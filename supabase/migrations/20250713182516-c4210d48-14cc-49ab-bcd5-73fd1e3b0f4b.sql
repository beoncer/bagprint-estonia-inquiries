
-- Add model field to products table
ALTER TABLE products 
ADD COLUMN model text;

-- Update existing products with mock model names based on their names
UPDATE products 
SET model = CASE 
  WHEN name ILIKE '%puuvilla%' OR name ILIKE '%cotton%' THEN 'CB' || LPAD((ROW_NUMBER() OVER (ORDER BY created_at))::text, 3, '0')
  WHEN name ILIKE '%paber%' OR name ILIKE '%paper%' THEN 'PB' || LPAD((ROW_NUMBER() OVER (ORDER BY created_at))::text, 3, '0')
  WHEN name ILIKE '%string%' OR name ILIKE '%nöör%' THEN 'SB' || LPAD((ROW_NUMBER() OVER (ORDER BY created_at))::text, 3, '0')
  WHEN name ILIKE '%pakend%' OR name ILIKE '%box%' THEN 'BX' || LPAD((ROW_NUMBER() OVER (ORDER BY created_at))::text, 3, '0')
  ELSE 'MD' || LPAD((ROW_NUMBER() OVER (ORDER BY created_at))::text, 3, '0')
END
WHERE model IS NULL;
