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

  // Check if current meta tags match the pre-rendered data
  const shouldUpdateMetaTag = (tagName: string, newValue: string): boolean => {
    const existingTag = document.querySelector(`meta[name="${tagName}"]`);
    if (!existingTag) return true;
    
    const existingValue = existingTag.getAttribute('content');
    return existingValue !== newValue;
  };

  // Check if current title matches the pre-rendered data
  const shouldUpdateTitle = (newTitle: string): boolean => {
    return document.title !== newTitle;
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
      // Debug: Log what we're about to update vs what's already there
      const currentTitle = document.title;
      const currentDescription = document.querySelector('meta[name="description"]')?.getAttribute('content');
      
      console.log('🔍 SEO Update Debug:');
      console.log('  Current DOM title:', currentTitle);
      console.log('  Current DOM description:', currentDescription);
      console.log('  Supabase title:', seoData.title);
      console.log('  Supabase description:', seoData.description);
      
      // Check if the current meta tags already contain the correct pre-rendered data
      // If the current title and description already match what we want, don't update anything
      if (currentTitle === seoData.title && currentDescription === seoData.description) {
        console.log('✅ SEO already matches pre-rendered data, skipping update');
        return;
      }
      
      console.log('🔄 Updating SEO tags...');
      
      // Only update title if it's different from pre-rendered data
      if (seoData.title && shouldUpdateTitle(seoData.title)) {
        document.title = seoData.title;
      }

      // Only update meta description if it's different from pre-rendered data
      if (seoData.description && shouldUpdateMetaTag('description', seoData.description)) {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', seoData.description);
        }
      }

      // Only update meta keywords if they're different from pre-rendered data
      if (seoData.keywords && shouldUpdateMetaTag('keywords', seoData.keywords)) {
        const metaKeywords = document.querySelector('meta[name="keywords"]');
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

      // Only update Open Graph tags if they're different from pre-rendered data
      if (seoData.title && shouldUpdateMetaTag('og:title', seoData.title)) {
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
          ogTitle.setAttribute('content', seoData.title);
        }
      }

      if (seoData.description && shouldUpdateMetaTag('og:description', seoData.description)) {
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
          ogDescription.setAttribute('content', seoData.description);
        }
      }

      // Only update Twitter Card tags if they're different from pre-rendered data
      if (seoData.title && shouldUpdateMetaTag('twitter:title', seoData.title)) {
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) {
          twitterTitle.setAttribute('content', seoData.title);
        }
      }

      if (seoData.description && shouldUpdateMetaTag('twitter:description', seoData.description)) {
        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        if (twitterDescription) {
          twitterDescription.setAttribute('content', seoData.description);
        }
      }

      // Always update canonical URL to current path
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        const currentUrl = `https://leatex.ee${location.pathname}`;
        canonical.setAttribute('href', currentUrl);
      }
    }
  }, [seoData, location.pathname]);

  // This component doesn't render anything visible
  return null;
};

export default DynamicSEO;
