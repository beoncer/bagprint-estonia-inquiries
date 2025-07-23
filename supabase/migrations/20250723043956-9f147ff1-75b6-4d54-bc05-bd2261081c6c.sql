-- Fix all slug mismatches between pages table and DynamicSEO component mapping
UPDATE pages SET slug = 'blog' WHERE slug = 'Blog' AND name = 'Blogi';
UPDATE pages SET slug = 'about' WHERE slug = 'About us' AND name = 'Meist'; 
UPDATE pages SET slug = 'portfolio' WHERE slug = 'Our works' AND name = 'Tehtud tööd';