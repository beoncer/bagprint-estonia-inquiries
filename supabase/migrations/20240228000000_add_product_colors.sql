-- Add colors column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS colors text[] DEFAULT '{}';

-- Add index for color filtering
CREATE INDEX IF NOT EXISTS idx_products_colors ON products USING GIN (colors); 