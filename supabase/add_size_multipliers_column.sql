-- Add size_multipliers column to products table
-- This will store a JSON object mapping size names to multiplier values
-- Example: {"11x20cm": 1.0, "12x15cm": 1.1, "13x18cm": 1.2, "15x20cm": 1.3}

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS size_multipliers JSONB DEFAULT '{}'::jsonb;

-- Add a comment to document the column
COMMENT ON COLUMN products.size_multipliers IS 'JSON object mapping size names to multiplier values for size-based pricing';

-- Create an index for better performance when querying size multipliers
CREATE INDEX IF NOT EXISTS idx_products_size_multipliers ON products USING GIN (size_multipliers);

-- Update existing products to have empty size_multipliers if they don't have any
UPDATE products 
SET size_multipliers = '{}'::jsonb 
WHERE size_multipliers IS NULL; 