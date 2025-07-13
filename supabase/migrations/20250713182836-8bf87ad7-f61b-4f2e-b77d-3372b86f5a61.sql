
-- Add model field to products table
ALTER TABLE products 
ADD COLUMN model text;

-- Update existing products with model codes based on their type and creation order
UPDATE products 
SET model = CASE 
  WHEN type = 'cotton_bag' THEN 'CB' || LPAD((ROW_NUMBER() OVER (PARTITION BY type ORDER BY created_at))::text, 3, '0')
  WHEN type = 'paper_bag' THEN 'PB' || LPAD((ROW_NUMBER() OVER (PARTITION BY type ORDER BY created_at))::text, 3, '0')
  WHEN type = 'string_bag' THEN 'SB' || LPAD((ROW_NUMBER() OVER (PARTITION BY type ORDER BY created_at))::text, 3, '0')
  WHEN type = 'shoe_bag' THEN 'SH' || LPAD((ROW_NUMBER() OVER (PARTITION BY type ORDER BY created_at))::text, 3, '0')
  ELSE 'MD' || LPAD((ROW_NUMBER() OVER (ORDER BY created_at))::text, 3, '0')
END
WHERE model IS NULL;
