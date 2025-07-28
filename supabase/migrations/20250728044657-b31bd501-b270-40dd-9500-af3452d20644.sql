-- Fix the sitemap generation function to use correct domain and populate sitemap entries
-- Update the generate_sitemap_xml function to use leatex.ee
DROP FUNCTION IF EXISTS public.generate_sitemap_xml();

CREATE OR REPLACE FUNCTION public.generate_sitemap_xml()
RETURNS text
LANGUAGE plpgsql
AS $function$
DECLARE
    sitemap_xml TEXT;
    entry RECORD;
BEGIN
    sitemap_xml := '<?xml version="1.0" encoding="UTF-8"?>' || E'\n' ||
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
$function$;

-- Clear existing entries and populate with all necessary URLs
TRUNCATE sitemap_entries;

-- Insert static pages
INSERT INTO sitemap_entries (url, priority, changefreq, is_dynamic, lastmod) VALUES
('/', 1.0, 'weekly', false, CURRENT_DATE),
('/tooted', 0.9, 'weekly', false, CURRENT_DATE),
('/riidest-kotid', 0.8, 'weekly', false, CURRENT_DATE),
('/paberkotid', 0.8, 'weekly', false, CURRENT_DATE),
('/nooriga-kotid', 0.8, 'weekly', false, CURRENT_DATE),
('/sussikotid', 0.8, 'weekly', false, CURRENT_DATE),
('/meist', 0.7, 'monthly', false, CURRENT_DATE),
('/kontakt', 0.7, 'monthly', false, CURRENT_DATE),
('/portfoolio', 0.6, 'weekly', false, CURRENT_DATE),
('/blogi', 0.6, 'weekly', false, CURRENT_DATE);

-- Insert dynamic product pages
INSERT INTO sitemap_entries (url, priority, changefreq, is_dynamic, source_table, source_id, lastmod)
SELECT 
    '/tooted/' || slug,
    0.7,
    'weekly',
    true,
    'products',
    id,
    CURRENT_DATE
FROM products 
WHERE slug IS NOT NULL AND slug != '';

-- Insert dynamic blog posts
INSERT INTO sitemap_entries (url, priority, changefreq, is_dynamic, source_table, source_id, lastmod)
SELECT 
    '/blogi/' || slug,
    0.5,
    'monthly',
    true,
    'blog_posts',
    id,
    CURRENT_DATE
FROM blog_posts 
WHERE slug IS NOT NULL AND slug != '';

-- Update the sync function to use leatex.ee as well
DROP FUNCTION IF EXISTS public.sync_dynamic_sitemap_entries();

CREATE OR REPLACE FUNCTION public.sync_dynamic_sitemap_entries()
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
    -- Sync products
    INSERT INTO sitemap_entries (url, priority, changefreq, is_dynamic, source_table, source_id, lastmod)
    SELECT 
        '/tooted/' || slug,
        0.7,
        'weekly',
        true,
        'products',
        id,
        CURRENT_DATE
    FROM products 
    WHERE slug IS NOT NULL AND slug != ''
    ON CONFLICT (url) DO UPDATE SET
        lastmod = CURRENT_DATE,
        updated_at = NOW();

    -- Sync blog posts
    INSERT INTO sitemap_entries (url, priority, changefreq, is_dynamic, source_table, source_id, lastmod)
    SELECT 
        '/blogi/' || slug,
        0.5,
        'monthly',
        true,
        'blog_posts',
        id,
        CURRENT_DATE
    FROM blog_posts 
    WHERE slug IS NOT NULL AND slug != ''
    ON CONFLICT (url) DO UPDATE SET
        lastmod = CURRENT_DATE,
        updated_at = NOW();

    -- Remove entries for deleted content
    DELETE FROM sitemap_entries 
    WHERE is_dynamic = true 
    AND source_table = 'products' 
    AND source_id NOT IN (SELECT id FROM products WHERE slug IS NOT NULL AND slug != '');

    DELETE FROM sitemap_entries 
    WHERE is_dynamic = true 
    AND source_table = 'blog_posts' 
    AND source_id NOT IN (SELECT id FROM blog_posts WHERE slug IS NOT NULL AND slug != '');
END;
$function$;