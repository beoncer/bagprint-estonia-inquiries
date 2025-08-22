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

interface DynamicSEOProps {
  ssrPath?: string;
}

const DynamicSEO: React.FC<DynamicSEOProps> = ({ ssrPath }) => {
  const location = useLocation();
  const [seoData, setSeoData] = useState<SEOMetadata | null>(null);

  const getCurrentPageSlug = (): string => {
    const path = ssrPath || location.pathname;
    
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
      const pageSlug = getCurrentPageSlug();
      
      try {
        const { data, error } = await supabase
          .from('seo_metadata')
          .select('*')
          .eq('page', pageSlug)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching SEO data:', error);
        } else if (data) {
          setSeoData(data);
        }
      } catch (error) {
        console.error('Error fetching SEO data:', error);
      }
    };

    fetchSEOData();
  }, [location.pathname, ssrPath]);

  return (
    <Helmet>
      {seoData?.title && <title>{seoData.title}</title>}
      {seoData?.description && <meta name="description" content={seoData.description} />}
      {seoData?.keywords && <meta name="keywords" content={seoData.keywords} />}
      
      {/* Open Graph */}
      {seoData?.title && <meta property="og:title" content={seoData.title} />}
      {seoData?.description && <meta property="og:description" content={seoData.description} />}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://leatex.ee${location.pathname}`} />
      
      {/* Twitter Card */}
      {seoData?.title && <meta name="twitter:title" content={seoData.title} />}
      {seoData?.description && <meta name="twitter:description" content={seoData.description} />}
      <meta name="twitter:card" content="summary_large_image" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={`https://leatex.ee${location.pathname}`} />
    </Helmet>
  );
};

export default DynamicSEO;
