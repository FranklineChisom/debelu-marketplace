// @ts-nocheck - AI SDK types lag behind runtime (maxSteps, toDataStreamResponse are runtime features)
import { groq } from '@ai-sdk/groq';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';

export const maxDuration = 300;

// Type for product records from Supabase
interface ProductRecord {
    id: string;
    name: string;
    description?: string;
    price: number;
    category?: string;
    image?: string;
    images?: string[];
    vendor_id?: string;
    vendor_name?: string;
    rating?: number;
    review_count?: number;
    stock?: number;
    campus_id?: string;
    created_at?: string;
    updated_at?: string;
}

interface ScoredProduct {
    product: ProductRecord;
    score: number;
    signals: string[];
}

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!process.env.GROQ_API_KEY) {
            console.error("Missing GROQ_API_KEY");
            return new Response(JSON.stringify({ error: "Missing GROQ_API_KEY in environment variables." }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // NOTE: The Vercel AI SDK has runtime features (maxSteps, toDataStreamResponse) 
        // that may not be in TypeScript definitions yet. These are documented here:
        // https://sdk.vercel.ai/docs/ai-sdk-core/generating-text
        // @ts-expect-error - maxSteps and tool execute types are supported at runtime
        const result = await streamText({
            model: groq('llama-3.3-70b-versatile'),
            system: `You are Debelu, an AI shopping assistant for a campus marketplace.

**CRITICAL: YOU MUST USE TOOLS**
When a user wants to find, search, buy, or see products, you MUST call the search_marketplace tool.
DO NOT just describe products in text. ALWAYS use the tool to fetch real products.

Examples of when to call search_marketplace:
- "find me laptops" → call search_marketplace with query "laptop"
- "I need headphones" → call search_marketplace with query "headphones"  
- "show me phones" → call search_marketplace with query "phone"
- "what do you have?" → call search_marketplace with query "popular"

ONLY respond with plain text for:
- Greetings like "hi" or "hello" (but still offer to help find products)
- Questions about orders, delivery, or account

TONE: Concise, warm, professional. Use markdown for formatting.`,
            messages,
            maxSteps: 5,
            tools: {
                search_marketplace: tool({
                    description: "Search for products in the marketplace. ALWAYS call this when user wants to find, buy, or see products.",
                    parameters: z.object({
                        query: z.string().optional().describe("Search keywords extracted from user request"),
                        category: z.enum(["Electronics", "Fashion", "Health", "Food", "Home", "Beauty"]).optional(),
                        price_intent: z.enum(["low", "medium", "high"]).optional()
                    }),
                    execute: async ({ query, category, price_intent }: { query?: string; category?: string; price_intent?: string }) => {
                        // Debug: Log received parameters
                        console.log("[Tool Call] search_marketplace received:", { query, category, price_intent });

                        // If query is empty, extract from the last user message
                        let searchQuery = query?.trim() || "";
                        if (!searchQuery) {
                            // Get last user message to extract intent
                            const lastUserMsg = messages.filter((m: { role: string }) => m.role === 'user').pop();
                            if (lastUserMsg) {
                                const content = (lastUserMsg as { content: string }).content || '';
                                // Extract key terms (remove common words)
                                const stopWords = ['find', 'me', 'some', 'show', 'i', 'want', 'need', 'looking', 'for', 'please', 'can', 'you', 'get', 'the', 'a', 'an'];
                                searchQuery = content.toLowerCase()
                                    .split(/\s+/)
                                    .filter((w: string) => w.length > 2 && !stopWords.includes(w))
                                    .join(' ') || 'popular';
                                console.log("[Tool Call] Extracted query from user message:", searchQuery);
                            }
                        }

                        if (!searchQuery) searchQuery = "popular";
                        console.log("[Tool Call] Final searchQuery:", searchQuery);

                        const supabase = await createClient();

                        // --- STRATEGY: PARALLEL RETRIEVAL & WEIGHTED RANKING ---
                        const scoreMap = new Map<string, ScoredProduct>();

                        const boostScore = (product: ProductRecord, points: number, signal: string) => {
                            const existing = scoreMap.get(product.id) || { product, score: 0, signals: [] };
                            existing.score += points;
                            if (!existing.signals.includes(signal)) existing.signals.push(signal);
                            scoreMap.set(product.id, existing);
                        };

                        // 1. Define Retrieval Promisess
                        const promises: Promise<void>[] = [];

                        // Signal A: Vector Search (Semantic Understanding) - Weight: 50
                        promises.push((async () => {
                            try {
                                const { generateEmbedding } = await import('@/utils/embeddings');
                                const embedding = await generateEmbedding(searchQuery);
                                const { data: vectorData } = await supabase.rpc('match_products', {
                                    query_embedding: embedding,
                                    match_threshold: 0.1, // Very loose to cast a wide net
                                    match_count: 15,
                                    category_filter: category || null
                                });
                                vectorData?.forEach((p: ProductRecord) => boostScore(p, 50, 'semantic'));
                            } catch (e) {
                                console.error("Vector signal failed", e);
                            }
                        })());

                        // Signal B: Keyword Exact Match (Precision) - Weight: 100
                        promises.push((async () => {
                            const term = `%${searchQuery}%`;
                            const { data: textData } = await supabase
                                .from('products')
                                .select('*')
                                .or(`name.ilike.${term},description.ilike.${term}`)
                                .limit(10);

                            textData?.forEach((p: ProductRecord) => boostScore(p, 100, 'text_match'));
                        })());

                        // Signal C: Category Relevance (Context) - Weight: 10
                        // We fetch a few popular items from the category as a baseline "safety net"
                        if (category) {
                            promises.push((async () => {
                                const { data: catData } = await supabase
                                    .from('products')
                                    .select('*')
                                    .eq('category', category.toLowerCase())
                                    .limit(20); // Broad context

                                catData?.forEach((p: ProductRecord) => boostScore(p, 10, 'category_context'));
                            })());
                        }

                        // 2. Execute All Signals
                        await Promise.all(promises);

                        // 3. Ranking & Refinement
                        let results = Array.from(scoreMap.values());

                        // Apply Price Intent Multipliers (Soft filtering, not hard exclusion)
                        if (price_intent) {
                            results.forEach(item => {
                                const price = item.product.price;
                                if (price_intent === 'low' && price < 50000) item.score *= 1.2;
                                if (price_intent === 'high' && price > 150000) item.score *= 1.2;
                            });
                        }

                        // Sort by final score
                        results.sort((a, b) => b.score - a.score);

                        // Debug Log for Transparency
                        console.log(`[Search Engine] Query: "${searchQuery}" | Candidates: ${results.length}`);
                        if (results.length > 0) {
                            console.log(`[Top Match] ${results[0].product.name} (Score: ${results[0].score}) [${results[0].signals.join(', ')}]`);
                        }

                        // 4. Final Selection or Intelligent Pivot
                        const finalProducts = results.slice(0, 6).map(r => r.product);

                        // If no products found, return helpful message
                        if (finalProducts.length === 0) {
                            console.log("[Tool Call] No products found for:", searchQuery);
                            return `No products found matching "${searchQuery}". Try a broader search like "laptop", "phone", or browse by category.`;
                        }

                        console.log(`[Tool Call] Found ${finalProducts.length} products`);
                        return finalProducts;
                    },
                }),
                compare_products: tool({
                    description: "Trigger the custom side-by-side comparison UI for products.",
                    parameters: z.object({
                        productIds: z.array(z.string()).describe("List of product IDs to compare")
                    }),
                    execute: async ({ productIds }: { productIds: string[] }) => {
                        const supabase = await createClient();
                        const { data } = await supabase.from('products').select('*').in('id', productIds);
                        return data || "No products found.";
                    },
                }),
                open_ui_panel: tool({
                    description: "Open specific marketplace panels like 'cart', 'checkout', or 'orders'.",
                    parameters: z.object({
                        panel: z.enum(["cart", "checkout", "orders"])
                    }),
                    execute: async ({ panel }: { panel: string }) => {
                        return { panel, status: "opened" };
                    },
                }),
            },
        });

        // Cast result for response methods (SDK types lag behind runtime)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const streamResult = result as any;

        console.log("[API] Stream result keys:", Object.keys(streamResult));
        console.log("[API] Has toDataStreamResponse:", typeof streamResult.toDataStreamResponse);
        console.log("[API] Has toDataStream:", typeof streamResult.toDataStream);
        console.log("[API] Has textStream:", !!streamResult.textStream);
        console.log("[API] Has fullStream:", !!streamResult.fullStream);

        // Try fullStream first (includes tool calls)
        if (streamResult.fullStream) {
            console.log("[API] Using fullStream");
            const stream = streamResult.fullStream.pipeThrough(new TransformStream({
                transform(chunk: unknown, controller: TransformStreamDefaultController) {
                    // chunk is already in data stream protocol format
                    const text = typeof chunk === 'string' ? chunk : JSON.stringify(chunk);
                    console.log("[API] fullStream chunk:", text.substring(0, 100));
                    controller.enqueue(new TextEncoder().encode(text + '\n'));
                }
            }));
            return new Response(stream, {
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'X-Vercel-AI-Data-Stream': 'v1'
                }
            });
        }

        // Standard Vercel AI SDK Response
        if (typeof streamResult.toDataStreamResponse === 'function') {
            console.log("[API] Using toDataStreamResponse");
            return streamResult.toDataStreamResponse();
        }

        // Fallback: Manual Data Stream Response
        if (typeof streamResult.toDataStream === 'function') {
            console.log("[API] Using toDataStream");
            return new Response(streamResult.toDataStream(), {
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'X-Vercel-AI-Data-Stream': 'v1'
                }
            });
        }

        // Fallback: Adapter for textStream (Raw Text -> Data Stream Protocol)
        if (streamResult.textStream) {
            console.log("[API] Using textStream fallback");
            const stream = (streamResult.textStream as ReadableStream).pipeThrough(new TransformStream({
                transform(chunk, controller) {
                    const text = typeof chunk === 'string' ? chunk : new TextDecoder().decode(chunk);
                    // Vercel AI Data Stream Protocol: 0:"<text>"
                    controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(text)}\n`));
                }
            }));

            return new Response(stream, {
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'X-Vercel-AI-Data-Stream': 'v1'
                }
            });
        }

        console.error("Stream Result Keys:", Object.keys(streamResult));
        throw new Error("Stream result does not support data stream protocol.");

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Chat API Error:", error);
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
