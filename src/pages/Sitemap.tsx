import { useEffect, useState } from 'react';
import { generateSitemapXML } from '@/utils/sitemapUtils';

const Sitemap: React.FC = () => {
  const [xml, setXml] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSitemap = async () => {
      try {
        setLoading(true);
        const sitemapXml = await generateSitemapXML();
        setXml(sitemapXml);
      } catch (error) {
        console.error('Error loading sitemap:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSitemap();
  }, []);

  if (loading) {
    return <div>Loading sitemap...</div>;
  }

  // Return the XML content
  return (
    <pre style={{ 
      whiteSpace: 'pre-wrap', 
      fontFamily: 'monospace', 
      fontSize: '12px',
      margin: 0,
      padding: '20px'
    }}>
      {xml}
    </pre>
  );
};

export default Sitemap; 