-- Fix category name mismatch between database and frontend
-- This script updates the product types to match what the frontend expects

-- First, let's see what product types currently exist
SELECT DISTINCT type FROM products ORDER BY type;

-- Update existing products that use the old category names
UPDATE products 
SET type = 'drawstring_bag' 
WHERE type = 'string_bag';

UPDATE products 
SET type = 'shoebag' 
WHERE type = 'shoe_bag';

-- Update the model codes for the corrected product types using CTE
WITH numbered_products AS (
  SELECT 
    id,
    CASE 
      WHEN type = 'cotton_bag' THEN 'CB' || LPAD((ROW_NUMBER() OVER (PARTITION BY type ORDER BY created_at))::text, 3, '0')
      WHEN type = 'paper_bag' THEN 'PB' || LPAD((ROW_NUMBER() OVER (PARTITION BY type ORDER BY created_at))::text, 3, '0')
      WHEN type = 'drawstring_bag' THEN 'SB' || LPAD((ROW_NUMBER() OVER (PARTITION BY type ORDER BY created_at))::text, 3, '0')
      WHEN type = 'shoebag' THEN 'SH' || LPAD((ROW_NUMBER() OVER (PARTITION BY type ORDER BY created_at))::text, 3, '0')
      ELSE 'MD' || LPAD((ROW_NUMBER() OVER (ORDER BY created_at))::text, 3, '0')
    END as model_code
  FROM products
  WHERE model IS NULL OR model LIKE 'SB%' OR model LIKE 'SH%'
)
UPDATE products 
SET model = numbered_products.model_code
FROM numbered_products
WHERE products.id = numbered_products.id;

-- Verify the changes
SELECT DISTINCT type, COUNT(*) as count 
FROM products 
GROUP BY type 
ORDER BY type;

-- Show a few sample products with their updated types
SELECT id, name, type, model, created_at 
FROM products 
ORDER BY created_at DESC 
LIMIT 10; 