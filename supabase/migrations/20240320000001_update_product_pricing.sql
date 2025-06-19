-- First, create a temporary table to store the old pricing data
CREATE TEMPORARY TABLE temp_product_prices AS
SELECT 
  id,
  COALESCE(
    (pricing_without_print->>'50')::decimal,
    (pricing_without_print->>'100')::decimal,
    (pricing_without_print->>'500')::decimal
  ) as base_price
FROM products;

-- Add base_price column
ALTER TABLE products
ADD COLUMN IF NOT EXISTS base_price decimal(10,2) NOT NULL DEFAULT 0;

-- Update base_price from old pricing data
UPDATE products p
SET base_price = t.base_price
FROM temp_product_prices t
WHERE p.id = t.id;

-- Remove old pricing columns
ALTER TABLE products
DROP COLUMN IF EXISTS pricing_without_print,
DROP COLUMN IF EXISTS pricing_with_print; 