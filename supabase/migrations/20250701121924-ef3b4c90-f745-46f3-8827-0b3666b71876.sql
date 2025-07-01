
-- Create sitemap_entries table
CREATE TABLE IF NOT EXISTS sitemap_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,
  priority DECIMAL(2,1) DEFAULT 0.5 CHECK (priority >= 0.0 AND priority <= 1.0),
  changefreq TEXT DEFAULT 'weekly' CHECK (changefreq IN ('always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never')),
  lastmod DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  is_dynamic BOOLEAN DEFAULT false,
  source_table TEXT,
  source_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE sitemap_entries ENABLE ROW LEVEL SECURITY;

-- Allow public read access for sitemap generation
CREATE POLICY "sitemap_entries_select_policy" ON sitemap_entries
  FOR SELECT USING (true);

-- Allow authenticated users to manage sitemap entries
CREATE POLICY "sitemap_entries_insert_policy" ON sitemap_entries
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "sitemap_entries_update_policy" ON sitemap_entries
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "sitemap_entries_delete_policy" ON sitemap_entries
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update lastmod automatically
CREATE OR REPLACE FUNCTION update_sitemap_lastmod()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.lastmod = CURRENT_DATE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic lastmod updates
CREATE TRIGGER sitemap_entries_update_trigger
    BEFORE UPDATE ON sitemap_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_sitemap_lastmod();

-- Insert default static pages
INSERT INTO sitemap_entries (url, priority, changefreq, is_dynamic) VALUES
('/', 1.0, 'weekly', false),
('/tooted', 0.9, 'weekly', false),
('/riidest-kotid', 0.8, 'weekly', false),
('/paberkotid', 0.8, 'weekly', false),
('/nooriga-kotid', 0.8, 'weekly', false),
('/sussikotid', 0.8, 'weekly', false),
('/kontakt', 0.7, 'monthly', false),
('/meist', 0.7, 'monthly', false),
('/portfoolio', 0.6, 'monthly', false),
('/blogi', 0.6, 'weekly', false)
ON CONFLICT (url) DO NOTHING;

-- Function to generate sitemap XML
CREATE OR REPLACE FUNCTION generate_sitemap_xml()
RETURNS TEXT AS $$
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
                       '    <loc>https://bagprint.ee' || entry.url || '</loc>' || E'\n' ||
                       '    <lastmod>' || entry.lastmod || '</lastmod>' || E'\n' ||
                       '    <changefreq>' || entry.changefreq || '</changefreq>' || E'\n' ||
                       '    <priority>' || entry.priority || '</priority>' || E'\n' ||
                       '    <xhtml:link rel="alternate" hreflang="et" href="https://bagprint.ee' || entry.url || '"/>' || E'\n' ||
                       '  </url>' || E'\n';
    END LOOP;
    
    sitemap_xml := sitemap_xml || '</urlset>';
    
    RETURN sitemap_xml;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-sync dynamic content
CREATE OR REPLACE FUNCTION sync_dynamic_sitemap_entries()
RETURNS VOID AS $$
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
    WHERE slug IS NOT NULL
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
    WHERE slug IS NOT NULL
    ON CONFLICT (url) DO UPDATE SET
        lastmod = CURRENT_DATE,
        updated_at = NOW();

    -- Remove entries for deleted content
    DELETE FROM sitemap_entries 
    WHERE is_dynamic = true 
    AND source_table = 'products' 
    AND source_id NOT IN (SELECT id FROM products WHERE slug IS NOT NULL);

    DELETE FROM sitemap_entries 
    WHERE is_dynamic = true 
    AND source_table = 'blog_posts' 
    AND source_id NOT IN (SELECT id FROM blog_posts WHERE slug IS NOT NULL);
END;
$$ LANGUAGE plpgsql;
