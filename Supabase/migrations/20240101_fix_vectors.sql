-- 1. Alter the embedding column to 384 dimensions (matching all-MiniLM-L6-v2)
-- This will wipe existing embeddings if they differ in dimension, but since we have none or invalid ones, it's fine.
ALTER TABLE public.products 
ALTER COLUMN embedding TYPE vector(384);

-- 2. Create the Hybrid Search Function (RPC)
-- This combines Vector Similarity (Cosine) with Filter logic
CREATE OR REPLACE FUNCTION match_products (
  query_embedding vector(384),
  match_threshold float,
  match_count int,
  category_filter text DEFAULT NULL,
  price_min numeric DEFAULT NULL,
  price_max numeric DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  category text,
  price numeric,
  images jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.description,
    p.category,
    p.price,
    p.images,
    1 - (p.embedding <=> query_embedding) AS similarity
  FROM products p
  WHERE 1 - (p.embedding <=> query_embedding) > match_threshold
  AND (category_filter IS NULL OR p.category = category_filter)
  AND (price_min IS NULL OR p.price >= price_min)
  AND (price_max IS NULL OR p.price <= price_max)
  ORDER BY p.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
