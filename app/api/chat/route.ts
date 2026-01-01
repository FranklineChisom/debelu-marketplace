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
            system: `You are Debelu, an expert personal shopping concierge. You are not just a search engine; you are a tasteful curator.

        TONE & STYLE:
        - Concise, warm, and professional (think Apple Store Genius).
        - proactive but never pushy.
        - formatting: Use bullet points for lists. bold key product names.
        
        CRITICAL INSTRUCTIONS:
        1. **Context is King**: If the user's query is vague (e.g., "red ones"), assume they refer to the context of previous messages or the category they are browsing.
        2. **Never Dead End**: If a search returns 0 results, DO NOT just say "I found nothing." Instead, suggest a broader category or a popular alternative.
        3. **Visuals First**: Always prefer showing products via the 'product cards' (which happen automatically when you return data) rather than just listing text.
        4. **Search Smart**: 
           - If a user asks for "cheap gaming laptop", search for "gaming laptop" and mention you can filter by price.
           - If a user is 'tired', suggest comfort items or wellness products smoothly.

        Your goal is to guide them to a purchase with the elegance of a premium service.`,
            messages,
            maxSteps: 5,
            tools: {
                search_marketplace: tool({
                    description: "Search for products. Call this whenever the user expresses interest in buying or finding something.",
                    parameters: z.object({
                        query: z.string().describe("The search term. Simplify complex queries to keywords (e.g 'cheap red shoes' -> 'red shoes')"),
                        category: z.enum(["Electronics", "Fashion", "Health", "Food", "Home", "Beauty"]).optional(),
                        price_intent: z.enum(["low", "medium", "high"]).optional().describe("Infer if user wants cheap/budget or premium items")
                    }),
                    execute: async ({ query, category, price_intent }: { query: string; category?: string; price_intent?: string }) => {
                        const supabase = await createClient();

                        // --- STRATEGY: PARALLEL RETRIEVAL & WEIGHTED RANKING (Apple-Style Engineering) ---
                        // Instead of brittle if/else chains, we fetch from multiple signals and blend them mathematically.

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
                                const embedding = await generateEmbedding(query);
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
                        if (query && query.trim()) {
                            promises.push((async () => {
                                const term = `%${query}%`;
                                const { data: textData } = await supabase
                                    .from('products')
                                    .select('*')
                                    .or(`name.ilike.${term},description.ilike.${term}`)
                                    .limit(10);

                                textData?.forEach((p: ProductRecord) => boostScore(p, 100, 'text_match'));
                            })());
                        }

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
                        console.log(`[Search Engine] Query: "${query}" | Candidates: ${results.length}`);
                        if (results.length > 0) {
                            console.log(`[Top Match] ${results[0].product.name} (Score: ${results[0].score}) [${results[0].signals.join(', ')}]`);
                        }

                        // 4. Final Selection or Intelligent Pivot
                        // We return the raw products. The LLM decides how to present them.
                        // If the top score is very low (e.g. only category matches), the LLM context will see that.
                        const finalProducts = results.slice(0, 6).map(r => r.product);

                        return finalProducts.length > 0
                            ? finalProducts
                            : "No products matched. Recommend performing a broader category search.";
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

        // Standard Vercel AI SDK Response
        if (typeof streamResult.toDataStreamResponse === 'function') {
            return streamResult.toDataStreamResponse();
        }

        // Fallback: Manual Data Stream Response
        if (typeof streamResult.toDataStream === 'function') {
            return new Response(streamResult.toDataStream(), {
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'X-Vercel-AI-Data-Stream': 'v1'
                }
            });
        }

        // Fallback: Adapter for textStream (Raw Text -> Data Stream Protocol)
        if (streamResult.textStream) {
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
