-- Revert the hardcoded domain and make it dynamic again
CREATE OR REPLACE FUNCTION generate_sitemap_xml()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    sitemap_xml TEXT;
    entry_xml TEXT;
    base_url TEXT;
BEGIN
    -- Get base URL dynamically from request headers or use a default
    -- This will be handled by the edge function that calls this
    base_url := current_setting('app.base_url', true);
    
    -- If no base URL is set, we'll let the edge function handle it
    IF base_url IS NULL OR base_url = '' THEN
        base_url := '';
    END IF;
    
    -- Start sitemap XML
    sitemap_xml := '<?xml version="1.0" encoding="UTF-8"?>' || E'\n' ||
                   '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' || E'\n';
    
    -- Add entries from sitemap table
    FOR entry_xml IN
        SELECT 
            '  <url>' || E'\n' ||
            '    <loc>' || COALESCE(base_url, '') || url || '</loc>' || E'\n' ||
            '    <lastmod>' || lastmod || '</lastmod>' || E'\n' ||
            '    <changefreq>' || changefreq || '</changefreq>' || E'\n' ||
            '    <priority>' || priority || '</priority>' || E'\n' ||
            '    <xhtml:link rel="alternate" hreflang="et" href="' || COALESCE(base_url, '') || url || '" />' || E'\n' ||
            '  </url>' || E'\n'
        FROM sitemap_entries
        WHERE is_active = true
        ORDER BY priority DESC, url
    LOOP
        sitemap_xml := sitemap_xml || entry_xml;
    END LOOP;
    
    -- Close sitemap XML
    sitemap_xml := sitemap_xml || '</urlset>';
    
    RETURN sitemap_xml;
END;
$$;