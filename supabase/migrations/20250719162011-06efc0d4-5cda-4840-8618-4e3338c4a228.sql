-- Update failing Unsplash images in website_content with local fallbacks
UPDATE website_content 
SET value = 'https://ixotpxliaerkzjznyipi.supabase.co/storage/v1/object/public/site-assets/category-paper-bags.jpg'
WHERE key = 'product_category_2_image' AND value LIKE '%unsplash.com%';

UPDATE website_content 
SET value = 'https://ixotpxliaerkzjznyipi.supabase.co/storage/v1/object/public/site-assets/category-shoe-bags.jpg'
WHERE key = 'product_category_4_image' AND value LIKE '%unsplash.com%';