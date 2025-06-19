-- Enable the pg_trgm extension for text search if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add colors column to products table if it doesn't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS colors text[] DEFAULT '{}';

-- Create GIN index for faster array operations and searches
CREATE INDEX IF NOT EXISTS idx_products_colors 
ON products USING GIN (colors);

-- Create or replace function to search products by color
CREATE OR REPLACE FUNCTION search_products_by_colors(search_colors text[])
RETURNS SETOF products AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM products
  WHERE colors && search_colors; -- && operator checks for array overlap
END;
$$ LANGUAGE plpgsql;

-- Example usage:
-- SELECT * FROM search_products_by_colors(ARRAY['red', 'blue']);

-- Create RLS policy for colors (if you're using RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON products
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON products
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON products
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only" ON products
    FOR DELETE
    TO authenticated
    USING (true);

-- Example of how to update existing products with colors:
/*
UPDATE products
SET colors = ARRAY['naturalne', 'punane']
WHERE id = 'your-product-id';
*/

-- Create a function to update product colors
CREATE OR REPLACE FUNCTION update_product_colors(
  product_id text,
  new_colors text[]
)
RETURNS products AS $$
DECLARE
  updated_product products;
BEGIN
  UPDATE products
  SET 
    colors = new_colors,
    updated_at = NOW()
  WHERE id = product_id
  RETURNING * INTO updated_product;
  
  RETURN updated_product;
END;
$$ LANGUAGE plpgsql; 