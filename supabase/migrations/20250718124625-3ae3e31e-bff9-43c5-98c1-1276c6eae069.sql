
-- Add missing admin-products SEO metadata entry
INSERT INTO seo_metadata (page, title, description, keywords) 
VALUES (
  'admin-products',
  'Toodete haldus - Admin',
  'Toodete haldamise lehekülg administraatori panelis',
  'admin, tooted, haldus, products, management'
) 
ON CONFLICT (page) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  keywords = EXCLUDED.keywords,
  updated_at = NOW();
