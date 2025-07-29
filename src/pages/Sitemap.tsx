import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Sitemap: React.FC = () => {
  const [sitemap, setSitemap] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateSitemap = async () => {
      try {
        setLoading(true);
        setError(null);

        // Call the database function to generate sitemap XML
        const { data, error: functionError } = await supabase.rpc('generate_sitemap_xml');
        
        if (functionError) {
          console.error('Error generating sitemap:', functionError);
          setError('Failed to generate sitemap');
          return;
        }

        // Set the base URL in the XML
        const baseUrl = 'https://leatex.ee';
        const sitemapWithBaseUrl = data.replace(/(<loc>)/g, `$1${baseUrl}`);
        
        setSitemap(sitemapWithBaseUrl);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load sitemap');
      } finally {
        setLoading(false);
      }
    };

    generateSitemap();
  }, []);

  useEffect(() => {
    // Replace the entire document with XML when sitemap is ready
    if (sitemap && !loading && !error) {
      document.open();
      document.write(sitemap);
      document.close();
    }
  }, [sitemap, loading, error]);

  if (loading) {
    return <div>Loading sitemap...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // This component renders but gets replaced by the XML
  return <div>Generating sitemap...</div>;
};

export default Sitemap;