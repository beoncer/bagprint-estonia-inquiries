-- Fix category links to use dedicated routes instead of query parameters
UPDATE website_content 
SET value = '/paberkotid' 
WHERE key = 'product_category_2_link' AND page = 'home';

UPDATE website_content 
SET value = '/nooriga-kotid' 
WHERE key = 'product_category_3_link' AND page = 'home';

UPDATE website_content 
SET value = '/sussikotid' 
WHERE key = 'product_category_4_link' AND page = 'home';