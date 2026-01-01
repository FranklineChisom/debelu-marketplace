
import { pipeline } from '@xenova/transformers';

// Singleton to prevent reloading the model on every request
let embeddingPipeline: any = null;

export async function generateEmbedding(text: string): Promise<number[]> {
    if (!embeddingPipeline) {
        console.log("Loading embedding model...");
        // 'all-MiniLM-L6-v2' is a standard, fast model for semantic similarity
        // quantize: true makes it smaller and faster with minimal accuracy loss
        embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
            quantized: true,
        });
    }

    // Clean text
    const cleanText = text.replace(/\n/g, ' ').trim();
    if (!cleanText) return new Array(1536).fill(0); // Return empty vector if no text

    // Generate embedding
    // pooling: 'mean' averages the token vectors to get a sentence vector
    // normalize: true ensures cosine similarity works efficiently (dot product)
    const output = await embeddingPipeline(cleanText, { pooling: 'mean', normalize: true });

    // The output is a Tensor, we need a plain array
    const embedding = Array.from(output.data);

    // NOTE: The 'all-MiniLM-L6-v2' model usually returns 384 dimensions.
    // BUT your Supabase schema expects 1536 (OpenAI standard).
    // We must PAD the vector to 1536 dimensions to fit the column constraints without later altering schema.
    // Or, ideally, we should update the schema to vector(384).
    // For now, to match the schema provided, we will pad with zeros.
    // IMPORTANT: If we want to switch to OpenAI later, this padding is harmless (just wasted space).
    // BUT for "Real AI" strictly, 384 matches are better.
    // To respect the USER's existing schema constraints (1536), we pad.

    // PADDING LOGIC:
    const paddedEmbedding = new Array(1536).fill(0);
    for (let i = 0; i < embedding.length; i++) {
        paddedEmbedding[i] = Number(embedding[i]);
    }

    return paddedEmbedding;
}
