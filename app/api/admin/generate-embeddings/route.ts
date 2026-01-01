import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { generateEmbedding } from '@/utils/embeddings';

// This process can take time, so we increase the max duration
export const maxDuration = 60; // 60 seconds

export async function POST(req: Request) {
    try {
        const supabase = await createClient();

        // 1. Fetch all products that need embeddings (or all of them to be safe)
        const { data: products, error } = await supabase.from('products').select('id, name, description, category, tags');

        if (error) throw error;
        if (!products || products.length === 0) return NextResponse.json({ message: "No products found." });

        console.log(`Generating embeddings for ${products.length} products...`);
        let updatedCount = 0;

        // 2. Loop and generate embeddings
        for (const product of products) {
            // Construct a rich context string
            const contextText = `
                Product: ${product.name}
                Category: ${product.category}
                Description: ${product.description || ''}
                Tags: ${product.tags ? product.tags.join(', ') : ''}
            `.trim();

            const embedding = await generateEmbedding(contextText);

            // 3. Update the product in DB
            const { error: updateError } = await supabase
                .from('products')
                .update({ embedding: embedding as any }) // 'as any' casting for pgvector array
                .eq('id', product.id);

            if (updateError) {
                console.error(`Failed to update product ${product.id}:`, updateError);
            } else {
                updatedCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Successfully generated embeddings for ${updatedCount} / ${products.length} products.`
        });

    } catch (error: any) {
        console.error("Embedding Generation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
