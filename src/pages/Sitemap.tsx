import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Sitemap: React.FC = () => {
  useEffect(() => {
    const generateXMLSitemap = async () => {
      try {
        // Call the Supabase function to generate sitemap XML
        const { data, error } = await supabase.rpc('generate_sitemap_xml');
        
        if (error) {
          console.error('Error generating sitemap:', error);
          return;
        }

        // Set the content type to XML
        document.head.querySelector('meta[http-equiv="Content-Type"]')?.remove();
        const metaTag = document.createElement('meta');
        metaTag.setAttribute('http-equiv', 'Content-Type');
        metaTag.setAttribute('content', 'application/xml; charset=utf-8');
        document.head.appendChild(metaTag);

        // Replace the entire document with XML content
        document.open();
        document.write(data);
        document.close();
      } catch (err) {
        console.error('Error:', err);
        // Fallback to basic XML structure
        const fallbackXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://leatex.ee/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
        
        document.open();
        document.write(fallbackXML);
        document.close();
      }
    };

    generateXMLSitemap();
  }, []);

  // This component won't render anything as it replaces the document
  return null;
};

export default Sitemap;