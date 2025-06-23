-- Add color_images column to products table
-- This will store a JSON object mapping color names to image URLs
-- Example: {"red": "https://...", "blue": "https://..."}

ALTER TABLE products 
ADD COLUMN color_images JSONB DEFAULT '{}'::jsonb;

-- Add a comment to document the column
COMMENT ON COLUMN products.color_images IS 'JSON object mapping color names to image URLs for color-specific product images'; 