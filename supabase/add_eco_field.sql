-- Add is_eco column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_eco boolean DEFAULT false;

-- Example: Set some products as eco-friendly
-- UPDATE products SET is_eco = true WHERE id = 'your-product-id'; 