-- Step 1: Clean up test products
DELETE FROM products WHERE slug IN ('asd', 'asdasdasd', 'asdasdasdas');

-- Step 2: Add missing static pages to sitemap
INSERT INTO sitemap_entries (url, priority, changefreq, is_dynamic, lastmod, is_active) VALUES
('/e-poe-pakendid', 0.8, 'weekly', false, CURRENT_DATE, true),
('/meist', 0.6, 'monthly', false, CURRENT_DATE, true),
('/portfoolio', 0.7, 'weekly', false, CURRENT_DATE, true),
('/blogi', 0.6, 'weekly', false, CURRENT_DATE, true),
('/kontakt', 0.9, 'monthly', false, CURRENT_DATE, true)
ON CONFLICT (url) DO UPDATE SET
  lastmod = CURRENT_DATE,
  updated_at = NOW(),
  is_active = true;

-- Step 3: Update the sitemap generation function to include XSL stylesheet
CREATE OR REPLACE FUNCTION public.generate_sitemap_xml()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    sitemap_xml TEXT;
    entry RECORD;
BEGIN
    sitemap_xml := '<?xml version="1.0" encoding="UTF-8"?>' || E'\n' ||
                   '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>' || E'\n' ||
                   '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' || E'\n' ||
                   '        xmlns:xhtml="http://www.w3.org/1999/xhtml">' || E'\n';
    
    FOR entry IN 
        SELECT url, priority, changefreq, lastmod
        FROM sitemap_entries 
        WHERE is_active = true 
        ORDER BY priority DESC, url ASC
    LOOP
        sitemap_xml := sitemap_xml || '  <url>' || E'\n' ||
                       '    <loc>https://leatex.ee' || entry.url || '</loc>' || E'\n' ||
                       '    <lastmod>' || entry.lastmod || '</lastmod>' || E'\n' ||
                       '    <changefreq>' || entry.changefreq || '</changefreq>' || E'\n' ||
                       '    <priority>' || entry.priority || '</priority>' || E'\n' ||
                       '    <xhtml:link rel="alternate" hreflang="et" href="https://leatex.ee' || entry.url || '"/>' || E'\n' ||
                       '  </url>' || E'\n';
    END LOOP;
    
    sitemap_xml := sitemap_xml || '</urlset>';
    
    RETURN sitemap_xml;
END;
$$;

-- Step 4: Create triggers to auto-update sitemap when content changes
CREATE OR REPLACE FUNCTION public.auto_sync_sitemap()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    -- Call the sync function to update sitemap entries
    PERFORM sync_dynamic_sitemap_entries();
    
    -- Optionally call the edge function to regenerate the sitemap file
    -- This would require the edge function to be set up for internal calls
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers for products table
DROP TRIGGER IF EXISTS trigger_auto_sync_sitemap_products ON products;
CREATE TRIGGER trigger_auto_sync_sitemap_products
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION auto_sync_sitemap();

-- Create triggers for blog_posts table
DROP TRIGGER IF EXISTS trigger_auto_sync_sitemap_blog_posts ON blog_posts;
CREATE TRIGGER trigger_auto_sync_sitemap_blog_posts
    AFTER INSERT OR UPDATE OR DELETE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION auto_sync_sitemap();