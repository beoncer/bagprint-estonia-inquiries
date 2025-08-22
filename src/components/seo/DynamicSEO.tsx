import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabase';

interface SEOMetadata {
  id: string;
  page: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
}

const DynamicSEO: React.FC = () => {
  const location = useLocation();
  const [seoData, setSeoData] = useState<SEOMetadata | null>(null);
  const [loading, setLoading] = useState(false);

  // Get the current page slug from the URL
  const getCurrentPageSlug = (): string => {
    const path = location.pathname;
    
    // Map common routes to slugs
    const routeToSlug: Record<string, string> = {
      '/': 'home',
      '/tooted': 'products',
      '/riidest-kotid': 'cotton-bags',
      '/paberkotid': 'paper-bags',
      '/nooriga-kotid': 'drawstring-bags',
      '/sussikotid': 'shoebags',
      '/kontakt': 'contact',
      '/meist': 'about',
      '/portfoolio': 'portfolio',
      '/blogi': 'blog',
      '/admin': 'admin',
    };

    return routeToSlug[path] || path.slice(1).replace(/\//g, '-') || 'home';
  };

  useEffect(() => {
    const fetchSEOData = async () => {
      setLoading(true);
      const pageSlug = getCurrentPageSlug();
      
      try {
        const { data, error } = await supabase
          .from('seo_metadata')
          .select('*')
          .eq('page', pageSlug)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
          console.error('Error fetching SEO data:', error);
        } else if (data) {
          setSeoData(data);
        } else {
          setSeoData(null);
        }
      } catch (error) {
        console.error('Error fetching SEO data:', error);
        setSeoData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSEOData();
  }, [location.pathname]);

  // Render SEO tags using react-helmet-async for consistency with SSR
  if (!seoData) return null;

  const canonicalUrl = `https://leatex.ee${location.pathname}`;

  return (
    <Helmet>
      <html lang="et" />
      {seoData.title && <title>{seoData.title}</title>}
      {seoData.description && <meta name="description" content={seoData.description} />}
      {seoData.keywords && <meta name="keywords" content={seoData.keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      
      {seoData.title && <meta property="og:title" content={seoData.title} />}
      {seoData.description && <meta property="og:description" content={seoData.description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Leatex" />
      
      <meta name="twitter:card" content="summary_large_image" />
      {seoData.title && <meta name="twitter:title" content={seoData.title} />}
      {seoData.description && <meta name="twitter:description" content={seoData.description} />}
    </Helmet>
  );
};

export default DynamicSEO;
