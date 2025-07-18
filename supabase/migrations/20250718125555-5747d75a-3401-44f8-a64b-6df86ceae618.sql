-- Add missing admin SEO metadata entry
INSERT INTO seo_metadata (page, title, description, keywords) 
VALUES (
  'admin',
  'Admin Panel - Bagprint',
  'Admin panel for managing products, content and settings',
  'admin, panel, management, products, content'
) 
ON CONFLICT (page) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  updated_at = NOW();