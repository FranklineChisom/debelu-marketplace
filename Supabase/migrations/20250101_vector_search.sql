-- Enable the vector extension if not already enabled
create extension if not exists vector;

-- Create a function to search for products by their embedding
-- This allows us to find "similar" products based on meaning
create or replace function match_products (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  category_filter text default null
)
returns setof products
language plpgsql
as $$
begin
  return query
  select *
  from products
  where 1 - (products.embedding <=> query_embedding) > match_threshold
  and (category_filter is null or products.category = category_filter)
  order by products.embedding <=> query_embedding
  limit match_count;
end;
$$;
