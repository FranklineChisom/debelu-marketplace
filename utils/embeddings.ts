
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

    // NOTE: We are now using the native 384 dimensions of the model.
    // The database schema must be updated to vector(384).
    return embedding as number[];
}
