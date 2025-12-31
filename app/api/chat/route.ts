import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';

// Create Groq provider instance
// Requires GROQ_API_KEY environment variable to be set
const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
});

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: groq('llama-3.3-70b-versatile'),
        messages,
        system: `You are Debelu, a helpful marketplace assistant for Nigerian students. 
    
    Your capabilities:
    1. Help students find products on their campus (UNILAG, UNN, etc.).
    2. Compare prices and features of gadgets, fashion, and food.
    3. Assist with adding items to cart and checking out.
    
    Personality:
    - Friendly, concise, and helpful.
    - occasionally use Nigerian student slang like "How far", "No wahala", "Omo", "Dey play".
    - Prioritize budget-friendly options unless asked otherwise.
    
    Context:
    - You are embedded in the Debelu Marketplace app.
    - Use the 'searchProducts' tool to find items for the user.
    - Use 'addToCart' when the user explicitly asks to buy something or add it to their cart.
    `,
        tools: {
            searchProducts: tool({
                description: 'Search for products in the marketplace by name, category, or price.',
                parameters: z.object({
                    query: z.string().describe('The search query (e.g., "laptop", "sneakers")'),
                    category: z.string().optional().describe('Filter by category (e.g., "Electronics", "Fashion")'),
                    maxPrice: z.number().optional().describe('Maximum price in Naira'),
                }),
                execute: async ({ query, category, maxPrice }) => {
                    const supabase = await createClient();

                    let dbQuery = supabase
                        .from('products')
                        .select('id, name, price, image, vendor_id, rating, stock, category, description')
                        // Simple search using ILIKE for now. In production, use textSearch with an index.
                        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
                        .limit(5);

                    if (category) {
                        dbQuery = dbQuery.eq('category', category);
                    }

                    if (maxPrice) {
                        dbQuery = dbQuery.lte('price', maxPrice);
                    }

                    const { data, error } = await dbQuery;

                    if (error) {
                        console.error("Product search error:", error);
                        return { error: 'Failed to search products.' };
                    }

                    if (!data || data.length === 0) {
                        return { info: "No products found matching that query." };
                    }

                    return { products: data };
                },
            }),
            addToCart: tool({
                description: 'Add a product to the user\'s shopping cart.',
                parameters: z.object({
                    productId: z.string().describe('The ID of the product to add'),
                    quantity: z.number().default(1).describe('Quantity to add'),
                }),
                execute: async ({ productId, quantity }) => {
                    // This is a client-side action trigger.
                    // The server just acknowledges the intent.
                    // The Client UI will observe this tool call and update the Zustand store.
                    return {
                        status: 'action_required',
                        message: `Please confirm adding product ${productId} (Qty: ${quantity}) to cart on your device.`,
                        productId,
                        quantity
                    };
                },
            }),
        },
    });

    return result.toDataStreamResponse();
}
