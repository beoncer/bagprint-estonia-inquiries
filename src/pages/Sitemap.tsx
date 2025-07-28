import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const Sitemap = () => {
  const [xmlContent, setXmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateSitemap = async () => {
      try {
        setLoading(true);
        
        // Call the edge function to generate sitemap
        const { data, error } = await supabase.functions.invoke('generate-sitemap');
        
        if (error) {
          console.error('Error generating sitemap:', error);
          throw error;
        }

        const sitemapXml = data?.xml || '';
        setXmlContent(sitemapXml);
        
      } catch (error) {
        console.error('Failed to generate sitemap:', error);
        
        // Fallback XML
        const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://leatex.ee/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
        
        setXmlContent(fallbackXml);
      } finally {
        setLoading(false);
      }
    };

    generateSitemap();
  }, []);

  useEffect(() => {
    if (xmlContent && !loading) {
      // Set document title and content type
      document.title = 'XML Sitemap';
      
      // Create a blob with XML content and proper MIME type
      const blob = new Blob([xmlContent], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      
      // Replace current page with XML content
      window.location.replace(url);
    }
  }, [xmlContent, loading]);

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#0f172a',
        color: '#e2e8f0',
        minHeight: '100vh'
      }}>
        <h1>Loading Sitemap...</h1>
        <p>Generating XML sitemap...</p>
      </div>
    );
  }

  // Fallback display in case the redirect doesn't work
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'monospace',
      backgroundColor: '#0f172a',
      color: '#e2e8f0',
      minHeight: '100vh'
    }}>
      <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>
        {xmlContent}
      </pre>
    </div>
  );
};

export default Sitemap;