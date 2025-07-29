import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const Sitemap: React.FC = () => {
  const [xml, setXml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSitemap = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Loading sitemap from database...');
        
        // First sync dynamic content
        const { error: syncError } = await supabase.rpc('sync_dynamic_sitemap_entries');
        if (syncError) {
          console.error('Sync error:', syncError);
        } else {
          console.log('Dynamic content synced');
        }
        
        // Generate XML from database
        const { data: sitemapXml, error: xmlError } = await supabase.rpc('generate_sitemap_xml');
        
        if (xmlError) {
          console.error('XML generation error:', xmlError);
          setError(xmlError.message);
          return;
        }
        
        if (!sitemapXml) {
          setError('No sitemap XML generated');
          return;
        }
        
        console.log('Generated XML length:', sitemapXml.length);
        setXml(sitemapXml);
        
      } catch (error: any) {
        console.error('Error loading sitemap:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSitemap();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        Loading sitemap from database...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace', color: 'red' }}>
        Error: {error}
      </div>
    );
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