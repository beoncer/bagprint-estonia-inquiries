-- Add product badges array to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS badges text[] DEFAULT '{}';

-- Create an enum type for badge types
CREATE TYPE badge_type AS ENUM (
  'eco',
  'organic',
  'reusable',
  'recycled'
);

-- Create a function to update product badges
CREATE OR REPLACE FUNCTION update_product_badges(
  product_id text,
  new_badges text[]
) RETURNS products AS $$
DECLARE
  updated_product products;
BEGIN
  UPDATE products
  SET 
    badges = new_badges,
    updated_at = NOW()
  WHERE id = product_id
  RETURNING * INTO updated_product;
  
  RETURN updated_product;
END;
$$ LANGUAGE plpgsql; 