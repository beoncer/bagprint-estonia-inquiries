import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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

  useEffect(() => {
    if (seoData) {
      // Update document title
      if (seoData.title) {
        document.title = seoData.title;
      }

      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && seoData.description) {
        metaDescription.setAttribute('content', seoData.description);
      }

      // Update meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (seoData.keywords) {
        if (metaKeywords) {
          metaKeywords.setAttribute('content', seoData.keywords);
        } else {
          // Create keywords meta tag if it doesn't exist
          const newMetaKeywords = document.createElement('meta');
          newMetaKeywords.setAttribute('name', 'keywords');
          newMetaKeywords.setAttribute('content', seoData.keywords);
          document.head.appendChild(newMetaKeywords);
        }
      }

      // Update Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle && seoData.title) {
        ogTitle.setAttribute('content', seoData.title);
      }

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription && seoData.description) {
        ogDescription.setAttribute('content', seoData.description);
      }

      // Update Twitter Card tags
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle && seoData.title) {
        twitterTitle.setAttribute('content', seoData.title);
      }

      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription && seoData.description) {
        twitterDescription.setAttribute('content', seoData.description);
      }

      // Update canonical URL
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        const currentUrl = `https://bagprint.ee${location.pathname}`;
        canonical.setAttribute('href', currentUrl);
      }
    }
  }, [seoData, location.pathname]);

  // This component doesn't render anything visible
  return null;
};

export default DynamicSEO; 