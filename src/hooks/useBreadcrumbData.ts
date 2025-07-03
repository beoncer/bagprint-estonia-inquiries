
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { BreadcrumbContext, PageType, ProductBreadcrumbData, BlogPostBreadcrumbData } from '@/types/breadcrumb';

export const useBreadcrumbData = () => {
  const location = useLocation();
  const [context, setContext] = useState<BreadcrumbContext>({ pageType: 'home' });
  const [loading, setLoading] = useState(false);

  // Category mapping for URLs
  const categoryPathMap: Record<string, string> = {
    '/riidest-kotid': 'cotton_bag',
    '/paberkotid': 'paper_bag',
    '/nooriga-kotid': 'drawstring_bag',
    '/sussikotid': 'shoebag',
  };

  // Category display names in Estonian
  const categoryDisplayNames: Record<string, string> = {
    'cotton_bag': 'Riidest kotid',
    'paper_bag': 'Paberkotid',
    'drawstring_bag': 'Nööriga kotid',
    'shoebag': 'Sussikotid',
  };

  const determinePageType = (pathname: string): PageType => {
    if (pathname === '/') return 'home';
    if (pathname === '/tooted') return 'products';
    if (pathname.startsWith('/tooted/') && pathname !== '/tooted') return 'product-detail';
    if (pathname === '/blogi') return 'blog';
    if (pathname.startsWith('/blogi/') && pathname !== '/blogi') return 'blog-post';
    if (Object.keys(categoryPathMap).includes(pathname)) return 'products';
    return 'static';
  };

  const fetchProductData = async (slug: string): Promise<ProductBreadcrumbData | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, type, slug')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product data for breadcrumbs:', error);
      return null;
    }
  };

  const fetchBlogPostData = async (slug: string): Promise<BlogPostBreadcrumbData | null> => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching blog post data for breadcrumbs:', error);
      return null;
    }
  };

  useEffect(() => {
    const updateBreadcrumbContext = async () => {
      const pathname = location.pathname;
      const pageType = determinePageType(pathname);
      
      let newContext: BreadcrumbContext = { pageType };

      // Handle category pages
      if (pageType === 'products' && categoryPathMap[pathname]) {
        newContext.categoryId = categoryPathMap[pathname];
      }

      // Handle product detail pages
      if (pageType === 'product-detail') {
        setLoading(true);
        const slug = pathname.split('/tooted/')[1];
        if (slug) {
          const productData = await fetchProductData(slug);
          if (productData) {
            newContext.productData = productData;
          }
        }
        setLoading(false);
      }

      // Handle blog post pages
      if (pageType === 'blog-post') {
        setLoading(true);
        const slug = pathname.split('/blogi/')[1];
        if (slug) {
          const blogPostData = await fetchBlogPostData(slug);
          if (blogPostData) {
            newContext.blogPostData = blogPostData;
          }
        }
        setLoading(false);
      }

      setContext(newContext);
    };

    updateBreadcrumbContext();
  }, [location.pathname]);

  return { context, loading, categoryDisplayNames };
};
