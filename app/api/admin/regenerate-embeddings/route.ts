import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { generateEmbedding } from '@/utils/embeddings';

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();

        // 1. Fetch all products
        const { data: products, error } = await supabase
            .from('products')
            .select('id, name, description, category');

        if (error) throw error;
        if (!products || products.length === 0) {
            return NextResponse.json({ message: "No products found to process." });
        }

        const results = [];
        console.log(`[Regen] Processing ${products.length} products...`);

        // 2. Generate and Update Embeddings
        for (const product of products) {
            try {
                // Create semantic text: "Gaming Laptop Pro. High performance laptop. Category: electronics"
                const text = `${product.name}. ${product.description || ''}. Category: ${product.category}`;

                const embedding = await generateEmbedding(text);

                const { error: updateError } = await supabase
                    .from('products')
                    .update({ embedding })
                    .eq('id', product.id);

                if (updateError) {
                    console.error(`[Regen] Failed to update ${product.name}:`, updateError);
                    results.push({ id: product.id, status: 'error', error: updateError.message });
                } else {
                    console.log(`[Regen] Updated ${product.name}`);
                    results.push({ id: product.id, name: product.name, status: 'updated' });
                }
            } catch (e) {
                console.error(`[Regen] Error processing ${product.name}:`, e);
                results.push({ id: product.id, status: 'failed', error: String(e) });
            }
        }

        return NextResponse.json({
            message: "Embeddings regeneration complete",
            processed: results.length,
            details: results
        });

    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
