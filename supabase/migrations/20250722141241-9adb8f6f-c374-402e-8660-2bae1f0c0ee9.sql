-- Fix the slug mismatch between pages table and seo_metadata table
UPDATE pages 
SET slug = 'products' 
WHERE slug = 'Products' AND name = 'Tooted';