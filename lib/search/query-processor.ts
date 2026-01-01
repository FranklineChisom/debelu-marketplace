import { groq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { z } from 'zod';

// Define the structured output schema for search intent
const SearchIntentSchema = z.object({
    query: z.string().describe("The cleaned product name including key adjectives (e.g., 'beautiful notebook' from 'beautiful notebookk', but remove filler words like 'show me')."),
    category: z.enum(["Electronics", "Fashion", "Health", "Food", "Home", "Beauty"]).optional(),
    sort: z.enum(["relevance", "price_asc", "price_desc", "rating"]).default("relevance"),
    price_min: z.number().optional(),
    price_max: z.number().optional(),
    tags: z.array(z.string()).optional(),
    reasoning: z.string().optional().describe("Brief explanation of why the query was modified (e.g., 'Corrected phonetic typo: lpp -> laptop').")
});

export type SearchIntent = z.infer<typeof SearchIntentSchema>;

export async function processQuery(userQuery: string, history: any[] = []): Promise<SearchIntent> {
    try {
        console.log(`[QueryProcessor] Analyzing: "${userQuery}"`);

        const { object } = await generateObject({
            model: groq('llama-3.1-70b-versatile'),
            schema: SearchIntentSchema,
            system: `You are an advanced Search Intent Extractor for a university marketplace.
            Analyze the user's query and extract PRECISE structural parameters.
            
            CRITICAL RULES:
            1. Extract ONLY the core product name as the 'query'. Correct typos using PHONETIC and FUZZY logic.
               - "chep computer" -> "computer", tags: ["cheap"]
               - "need a cheap computer" -> "computer"
               - "lptop", "lapptop" -> "laptop" (Phonetic fixes)
            2. Infer specific attributes as tags.
               - "red nike shoes" -> query: "shoe", tags: ["red", "nike"]
            3. Detect Price Sensitivity:
               - "cheap", "budget" -> sort: "price_asc"
               - "best", "premium" -> sort: "rating"
            4. If no clear product is found, use "popular" as query.
            
            EXPLAIN YOUR REASONING:
            Always provide a 'reasoning' string explaining your correction logic briefly.`,
            prompt: `User Query: "${userQuery}"\nContext: ${history.slice(-2).join(' ')}`
        });

        // Ensure reasoning exists even if LLM omitted it (soft fix)
        if (!object.reasoning) {
            object.reasoning = `Analyzed query structure and extracted core terms: "${object.query}"`;
        }

        console.log("[QueryProcessor] Extracted Intent:", object);
        return object;
    } catch (e) {
        console.error("[QueryProcessor] Failed to extract intent (AI Error):", e);
        // Fallback
        const cleanQuery = userQuery
            .replace(/\b(find|me|some|show|i|want|need|looking|for|a|an|the)\b/gi, '')
            .replace(/\b(cheap|expensive|affordable|budget|premium|best|good|great|nice|top)\b/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
        return {
            query: cleanQuery || userQuery,
            sort: 'relevance',
            reasoning: "I manually simplified the query to focus on key terms." // Nicer fallback message
        };
    }
}
