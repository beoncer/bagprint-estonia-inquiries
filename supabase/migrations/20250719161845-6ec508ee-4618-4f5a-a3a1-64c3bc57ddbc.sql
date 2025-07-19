-- Update failing Unsplash images in website_content with local fallbacks
UPDATE website_content 
SET value = 'https://ixotpxliaerkzjznyipi.supabase.co/storage/v1/object/public/site-assets/category-cotton-bags.jpg'
WHERE key = 'product_category_1_image' AND value LIKE '%unsplash.com%';

UPDATE website_content 
SET value = 'https://ixotpxliaerkzjznyipi.supabase.co/storage/v1/object/public/site-assets/category-paper-bags.jpg'
WHERE key = 'product_category_2_image' AND value LIKE '%unsplash.com%';

UPDATE website_content 
SET value = 'https://ixotpxliaerkzjznyipi.supabase.co/storage/v1/object/public/site-assets/category-shoe-bags.jpg'
WHERE key = 'product_category_4_image' AND value LIKE '%unsplash.com%';

-- Ensure we have all category images properly set
INSERT INTO website_content (page, key, value) 
VALUES 
  ('index', 'product_category_1_image', 'https://ixotpxliaerkzjznyipi.supabase.co/storage/v1/object/public/site-assets/category-cotton-bags.jpg'),
  ('index', 'product_category_2_image', 'https://ixotpxliaerkzjznyipi.supabase.co/storage/v1/object/public/site-assets/category-paper-bags.jpg'),
  ('index', 'product_category_3_image', 'https://ixotpxliaerkzjznyipi.supabase.co/storage/v1/object/public/site-assets/category-drawstring-bags.jpg'),
  ('index', 'product_category_4_image', 'https://ixotpxliaerkzjznyipi.supabase.co/storage/v1/object/public/site-assets/category-shoe-bags.jpg')
ON CONFLICT (page, key) DO UPDATE SET value = EXCLUDED.value;