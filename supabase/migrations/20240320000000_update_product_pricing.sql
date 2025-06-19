-- Remove old pricing columns and add base_price
ALTER TABLE products
DROP COLUMN IF EXISTS pricing_without_print,
DROP COLUMN IF EXISTS pricing_with_print,
ADD COLUMN IF NOT EXISTS base_price decimal(10,2) NOT NULL DEFAULT 0; 