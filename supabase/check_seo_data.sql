-- Check existing SEO data in the database
-- Run this in Supabase SQL editor to see what's already there

SELECT 
  page,
  title,
  description,
  keywords,
  created_at,
  updated_at
FROM seo_metadata
ORDER BY page;

-- Count total SEO entries
SELECT COUNT(*) as total_seo_entries FROM seo_metadata;

-- Check for specific pages
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM seo_metadata WHERE page = 'home') THEN '✅ Home page SEO exists'
    ELSE '❌ Home page SEO missing'
  END as home_status,
  
  CASE 
    WHEN EXISTS (SELECT 1 FROM seo_metadata WHERE page = 'products') THEN '✅ Products page SEO exists'
    ELSE '❌ Products page SEO missing'
  END as products_status,
  
  CASE 
    WHEN EXISTS (SELECT 1 FROM seo_metadata WHERE page = 'contact') THEN '✅ Contact page SEO exists'
    ELSE '❌ Contact page SEO missing'
  END as contact_status; 