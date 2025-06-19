-- Add is_eco column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS is_eco boolean DEFAULT false;

-- Create a function to toggle eco status
CREATE OR REPLACE FUNCTION toggle_eco_status(product_id text, new_status boolean)
RETURNS products AS $$
DECLARE
  updated_product products;
BEGIN
  UPDATE products
  SET 
    is_eco = new_status,
    updated_at = NOW()
  WHERE id = product_id
  RETURNING * INTO updated_product;
  
  RETURN updated_product;
END;
$$ LANGUAGE plpgsql; 