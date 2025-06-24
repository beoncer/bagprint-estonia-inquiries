-- Add main_color column to products table
ALTER TABLE products
ADD COLUMN main_color text;

COMMENT ON COLUMN products.main_color IS 'The color key (e.g., "red") whose image is used as the main product image'; 