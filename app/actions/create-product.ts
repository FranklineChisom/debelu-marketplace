"use server";

import { createClient } from "@/utils/supabase/server";
import { generateEmbedding } from "@/utils/embeddings";
import { Product } from "@/types/product";

export async function createProductAction(productData: any) {
    try {
        const supabase = await createClient();

        // 1. Generate Embedding (The "Soul")
        // We do this BEFORE insertion so the product is "intelligent" from millisecond 0
        const contextText = `
            Product: ${productData.name}
            Category: ${productData.category}
            Description: ${productData.description || ''}
            Tags: ${productData.tags ? productData.tags.join(', ') : ''}
        `.trim();

        // Generate embedding on the server
        console.log("Generating embedding for new product...");
        let embedding = [];
        try {
            embedding = await generateEmbedding(contextText);
        } catch (e) {
            console.error("Embedding generation failed, proceeding with empty vector:", e);
            // Don't block upload if AI fails, just log it. 
            // We can retry later via admin panel.
            embedding = new Array(1536).fill(0);
        }

        // 2. Insert into Database
        const { data, error } = await supabase.from('products').insert({
            ...productData,
            embedding: embedding
        }).select().single();

        if (error) {
            console.error("Supabase Insert Error:", error);
            return { success: false, error: error.message };
        }

        return { success: true, data };

    } catch (error: any) {
        console.error("Server Action Error:", error);
        return { success: false, error: error.message };
    }
}
