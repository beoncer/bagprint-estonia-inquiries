
-- Add model field to products table
ALTER TABLE products 
ADD COLUMN model text;

-- Update existing products with model codes using a subquery approach
WITH numbered_products AS (
  SELECT 
    id,
    CASE 
      WHEN type = 'cotton_bag' THEN 'CB' || LPAD((ROW_NUMBER() OVER (PARTITION BY type ORDER BY created_at))::text, 3, '0')
      WHEN type = 'paper_bag' THEN 'PB' || LPAD((ROW_NUMBER() OVER (PARTITION BY type ORDER BY created_at))::text, 3, '0')
      WHEN type = 'string_bag' THEN 'SB' || LPAD((ROW_NUMBER() OVER (PARTITION BY type ORDER BY created_at))::text, 3, '0')
      WHEN type = 'shoe_bag' THEN 'SH' || LPAD((ROW_NUMBER() OVER (PARTITION BY type ORDER BY created_at))::text, 3, '0')
      ELSE 'MD' || LPAD((ROW_NUMBER() OVER (ORDER BY created_at))::text, 3, '0')
    END as model_code
  FROM products
  WHERE model IS NULL
)
UPDATE products 
SET model = numbered_products.model_code
FROM numbered_products
WHERE products.id = numbered_products.id;
