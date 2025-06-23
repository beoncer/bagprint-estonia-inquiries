-- Add size_images column to products table
-- This will store a JSON object mapping size names to image URLs
-- Example: {"38x42cm": "https://...", "50x60cm": "https://..."}

ALTER TABLE products 
ADD COLUMN size_images JSONB DEFAULT '{}'::jsonb;

-- Add a comment to document the column
COMMENT ON COLUMN products.size_images IS 'JSON object mapping size names to image URLs for size-specific product images'; 