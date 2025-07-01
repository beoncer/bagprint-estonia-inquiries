
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const Sitemap = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateAndServeSitemap = async () => {
      try {
        setLoading(true);
        
        // Call the edge function to generate sitemap
        const { data, error } = await supabase.functions.invoke('generate-sitemap');
        
        if (error) {
          console.error('Error generating sitemap:', error);
          throw error;
        }

        // Get the generated XML
        const sitemapXml = data?.xml || '';
        
        // Set the document content type to XML and replace content
        document.open('application/xml');
        document.write(sitemapXml);
        document.close();
        
      } catch (error) {
        console.error('Failed to generate sitemap:', error);
        
        // Fallback - serve basic XML structure
        const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://bagprint.ee/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
        
        document.open('application/xml');
        document.write(fallbackXml);
        document.close();
      } finally {
        setLoading(false);
      }
    };

    generateAndServeSitemap();
  }, []);

  // This component shouldn't render anything visible since we're replacing the document
  return null;
};

export default Sitemap;
