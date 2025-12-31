import { createClient } from '@supabase/supabase-js';
import { createGroq } from '@ai-sdk/groq';
import { streamText, stepCountIs, tool } from 'ai';
import { z } from 'zod';

// Force rebuild timestamp

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Initialize Groq provider
const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY,
});

// Define the search parameters schema
const searchProductsSchema = z.object({
    query: z.string().describe('The search keyword'),
});

// Common words to filter out when extracting search terms
const STOP_WORDS = new Set([
    'i', 'me', 'my', 'a', 'an', 'the', 'to', 'for', 'of', 'and', 'or',
    'find', 'show', 'get', 'search', 'looking', 'want', 'need', 'buy',
    'can', 'you', 'please', 'some', 'any', 'good', 'best', 'cheap',
    'them', 'it', 'those', 'these', 'that', 'this'
]);

// Extract meaningful search terms from user message
function extractSearchQuery(message: string): string {
    const words = message.toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .split(/\s+/)
        .filter(word => word.length > 2 && !STOP_WORDS.has(word));

    // Return the most likely product keyword (usually the last meaningful word)
    return words.length > 0 ? words[words.length - 1] : '';
}

export async function POST(req: Request) {
    console.log('[Chat API] POST request received');

    try {
        const body = await req.json();
        const { messages } = body;

        console.log('[Chat API] Messages received:', messages?.length);
        const lastUserMessage = messages?.filter((m: any) => m.role === 'user').pop();
        console.log('[Chat API] Last user message:', lastUserMessage?.content);

        // Convert UI messages to core messages manually to avoid SDK version issues
        // Strip out client-side fields like id, createdAt, etc.
        const coreMessages: any[] = [];
        for (const m of messages) {
            if (m.role === 'user') {
                coreMessages.push({ role: 'user', content: m.content });
            } else if (m.role === 'system') {
                coreMessages.push({ role: 'system', content: m.content });
            } else if (m.role === 'assistant') {
                // Ensure text content is captured
                const textContent = m.content || "";

                // If message has tool invocations, we need to structure it as assistant message with tool calls
                // AND a subsequent tool message with results
                if (m.toolInvocations && m.toolInvocations.length > 0) {

                    // 1. Add Assistant message with tool calls
                    const assistantContent: any[] = [];
                    if (textContent) {
                        assistantContent.push({ type: 'text', text: textContent });
                    }

                    // Only include tool calls that have corresponding results in history (closed loop)
                    const validToolInvocations = m.toolInvocations.filter((ti: any) =>
                        ti.state === 'result' || ti.result !== undefined
                    );

                    if (validToolInvocations.length > 0) {
                        validToolInvocations.forEach((ti: any) => {
                            let args = ti.args;
                            try {
                                if (typeof args === 'string') {
                                    args = JSON.parse(args);
                                }
                            } catch (e) {
                                console.error('[Chat API] Failed to parse tool args:', args);
                                args = {};
                            }

                            assistantContent.push({
                                type: 'tool-call',
                                toolCallId: ti.toolCallId,
                                toolName: ti.toolName,
                                args: args
                            });
                        });

                        coreMessages.push({
                            role: 'assistant',
                            content: assistantContent
                        });

                        // 2. Add Tool message with results
                        const toolResults = validToolInvocations.map((ti: any) => ({
                            type: 'tool-result',
                            toolCallId: ti.toolCallId,
                            toolName: ti.toolName,
                            result: ti.result
                        }));

                        coreMessages.push({
                            role: 'tool',
                            content: toolResults
                        });
                    } else {
                        // If no valid tool invocations, distinct text content is fallback
                        coreMessages.push({ role: 'assistant', content: textContent });
                    }

                } else {
                    // Regular assistant message
                    coreMessages.push({ role: 'assistant', content: textContent });
                }
            }
        }

        const result = streamText({
            model: groq('llama-3.3-70b-versatile'),
            messages: coreMessages,
            stopWhen: stepCountIs(5),
            toolChoice: 'auto',
            system: `You are Debelu, a friendly shopping assistant for the Debelu Marketplace - a campus marketplace in Nigeria.

Your personality: Warm, helpful, and conversational like a knowledgeable friend.

IMPORTANT INSTRUCTIONS:
1. When users ask to "find" or "search" for new items, use the searchProducts tool.
2. When users ask to "compare", "describe", or asking about "them/it/those", referral to the products ALREADY in the chat history. DO NOT search again.
3. NEVER output internal XML tags like <function>. Use standard text.
4. If a search returns 0 results, ask for clarification.
5. Prices are in Nigerian Naira (₦).`,
            tools: {
                searchProducts: tool({
                    description: 'Search for products in the marketplace by keyword.',
                    parameters: searchProductsSchema,
                    execute: async (params: z.infer<typeof searchProductsSchema>) => {
                        console.log('[SearchProducts] Raw params:', params);

                        // Extract query - from params or fallback to user message
                        let query = params?.query?.trim();

                        if (!query && lastUserMessage?.content) {
                            query = extractSearchQuery(lastUserMessage.content);
                            console.log('[SearchProducts] Extracted query:', query);
                        }

                        if (!query) {
                            return { products: [], message: 'Please specify what product you are looking for.' };
                        }

                        try {
                            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                            const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

                            if (!supabaseUrl || !supabaseKey) {
                                console.error('[SearchProducts] Missing Supabase credentials');
                                return { products: [], error: 'Configuration error' };
                            }

                            // Naive singularization to improve match rate (laptops -> laptop)
                            if (query.endsWith('s') && query.length > 3) {
                                query = query.slice(0, -1);
                            }

                            // Custom fetch with longer timeout
                            const supabase = createClient(supabaseUrl, supabaseKey, {
                                global: {
                                    fetch: (url, options) => {
                                        return fetch(url, {
                                            ...options,
                                            signal: AbortSignal.timeout(30000), // 30s timeout
                                        });
                                    },
                                },
                            });
                            console.log(`[SearchProducts] Searching for: "${query}"`);

                            // Search in both name and description for better results
                            const { data, error } = await supabase
                                .from('products')
                                .select('id, name, description, price, images, category, vendor_id, rating, review_count, stock')
                                .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
                                .limit(6);

                            if (error) {
                                console.error('[SearchProducts] Supabase error:', error);
                                return { products: [], error: error.message };
                            }

                            console.log(`[SearchProducts] Found ${data?.length || 0} products`);

                            if (!data || data.length === 0) {
                                return {
                                    products: [],
                                    message: `No products found matching "${query}". please try a different keyword.`
                                };
                            }

                            return { products: data };
                        } catch (err) {
                            console.error('[SearchProducts] Error:', err);
                            return { products: [], error: 'Search failed' };
                        }
                    },
                } as any),
            },
            onFinish: ({ text, toolCalls, toolResults }) => {
                console.log('[Chat API] Finished:', {
                    textLength: text?.length,
                    toolCallsCount: toolCalls?.length,
                });
            },
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error('[Chat API] Error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
