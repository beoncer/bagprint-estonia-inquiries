-- Fix the products type constraint to include shoebag
ALTER TABLE products DROP CONSTRAINT products_type_check;

-- Add the updated constraint with all product types
ALTER TABLE products ADD CONSTRAINT products_type_check 
CHECK (type = ANY (ARRAY['cotton_bag'::text, 'paper_bag'::text, 'drawstring_bag'::text, 'packaging_box'::text, 'shoebag'::text]));