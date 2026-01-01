// @ts-nocheck - AI SDK types lag behind runtime (maxSteps, toDataStreamResponse are runtime features)
import { groq } from '@ai-sdk/groq';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { processQuery } from '@/lib/search/query-processor';

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
                    execute: async ({ query }: { query?: string }) => {
                        try {
                            const supabase = await createClient();

                            // 1. INTENT EXTRACTION (The "Brain")
                            // Even if a query is passed, we re-process it to get deep understanding (category, sort, etc.)
                            // If no query, we extract from chat history.
                            let rawQuery = query?.trim() || "";
                            if (!rawQuery) {
                                const lastUserMsg = messages.filter((m: { role: string }) => m.role === 'user').pop();
                                rawQuery = (lastUserMsg as { content: string })?.content || "";
                            }

                            // Use LLM to extract structured intent
                            const intent = await processQuery(rawQuery, messages.map((m: any) => `${m.role}: ${m.content}`));
                            console.log(`[Search Engine] Intent: ${JSON.stringify(intent)}`);

                            const RRF_K = 60; // Standard RRF constant
                            const scoreMap = new Map<string, { product: ProductRecord; score: number; methods: string[] }>();

                            const addRankScore = (product: ProductRecord, rank: number, method: string) => {
                                const existing = scoreMap.get(product.id) || { product, score: 0, methods: [] };
                                // RRF Formula: 1 / (k + rank)
                                existing.score += 1 / (RRF_K + rank);
                                if (!existing.methods.includes(method)) existing.methods.push(method);
                                scoreMap.set(product.id, existing);
                            };

                            const promises: Promise<void>[] = [];

                            // 2. SIGNAL A: VECTOR SEARCH (Semantic)
                            promises.push((async () => {
                                try {
                                    const { generateEmbedding } = await import('@/utils/embeddings');
                                    const embedding = await generateEmbedding(intent.query);

                                    // Call the new Hybrid RPC function
                                    const { data: vectorData, error } = await supabase.rpc('match_products', {
                                        query_embedding: embedding,
                                        match_threshold: 0.15, // Relaxed threshold for typos/fuzzy matches
                                        match_count: 20,
                                        category_filter: intent.category?.toLowerCase() || null,
                                        price_min: intent.price_min || null,
                                        price_max: intent.price_max || null
                                    });

                                    if (error) console.error("Vector RPC Error:", error);

                                    vectorData?.forEach((p: any, index: number) => {
                                        // Map RPC result back to ProductRecord structure if needed, or use as is
                                        // RPC returns: id, name, description, category, price, images, similarity
                                        addRankScore(p as ProductRecord, index + 1, 'vector'); // Rank is 1-based
                                    });
                                } catch (e) {
                                    console.error("Vector signal failed", e);
                                }
                            })());

                            // 3. SIGNAL B: KEYWORD SEARCH (Precision)
                            promises.push((async () => {
                                const term = `%${intent.query}%`;
                                const { data: keywordData } = await supabase
                                    .from('products')
                                    .select('*')
                                    .or(`name.ilike.${term},description.ilike.${term}`) // Deep Search
                                    .limit(10);

                                keywordData?.forEach((p: any, index: number) => {
                                    addRankScore(p as ProductRecord, index + 1, 'keyword');
                                });
                            })());

                            await Promise.all(promises);

                            // 4. RANKING & METADATA
                            const results = Array.from(scoreMap.values());

                            // Apply Sorting Intent
                            if (intent.sort === 'price_asc') {
                                results.sort((a, b) => a.product.price - b.product.price);
                            } else if (intent.sort === 'price_desc') {
                                results.sort((a, b) => b.product.price - a.product.price);
                            } else if (intent.sort === 'rating') {
                                results.sort((a, b) => (b.product.rating || 0) - (a.product.rating || 0));
                            } else {
                                // Default RRF Score Sort
                                results.sort((a, b) => b.score - a.score);
                            }

                            const finalProducts = results.slice(0, 6).map(r => {
                                const p = r.product;
                                // Normalize image field: Ensure 'image' property exists if 'images' array is present
                                return {
                                    ...p,
                                    image: p.image || (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null)
                                };
                            });

                            if (finalProducts.length === 0) {
                                console.log("[Search Engine] No results found.");
                                // Return metadata even on failure so user knows what happened
                                return {
                                    products: [],
                                    info: {
                                        originalQuery: rawQuery,
                                        correctedQuery: intent.query,
                                        intent: intent.sort !== 'relevance' ? `Sort: ${intent.sort}` : undefined,
                                        tags: intent.tags,
                                        method: 'Hybrid RRF (Zero Results)',
                                        reasoning: (intent as any).reasoning
                                    }
                                };
                            }

                            // Return rich object with metadata
                            console.log(`[Search Engine] Returning ${finalProducts.length} products. Top method: ${results[0].methods.join('+')}`);
                            return {
                                products: finalProducts,
                                info: {
                                    originalQuery: rawQuery,
                                    correctedQuery: intent.query,
                                    intent: intent.sort !== 'relevance' ? `Sort: ${intent.sort}` : undefined,
                                    tags: intent.tags,
                                    method: 'Hybrid RRF',
                                    reasoning: (intent as any).reasoning // Explain WHY
                                }
                            };

                        } catch (error) {
                            console.error("[Search Marketplace] Critical Error:", error);
                            return "I encountered an error while searching for products. Please try again or specify your search.";
                        }
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
