
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

// Product data interface for breadcrumb context
interface ProductForBreadcrumb {
  id: string;
  name: string;
  type: string;
}

// Fetch product data for breadcrumb context
const fetchProductBySlug = async (slug: string): Promise<ProductForBreadcrumb | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, type')
    .eq('slug', slug)
    .maybeSingle();
  
  if (error || !data) return null;
  return data;
};

// Fetch blog post data for breadcrumb context
const fetchBlogPostBySlug = async (slug: string): Promise<{ title: string } | null> => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('title')
    .eq('slug', slug)
    .maybeSingle();
  
  if (error || !data) return null;
  return data;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = "" }) => {
  const location = useLocation();
  
  // Extract potential product or blog slug from URL
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const isProductDetail = pathSegments.length === 2 && pathSegments[0] === 'tooted';
  const isBlogPost = pathSegments.length === 2 && pathSegments[0] === 'blogi';
  const productSlug = isProductDetail ? pathSegments[1] : null;
  const blogSlug = isBlogPost ? pathSegments[1] : null;
  
  // Fetch product data if we're on a product detail page
  const { data: productData } = useQuery({
    queryKey: ['product-for-breadcrumb', productSlug],
    queryFn: () => fetchProductBySlug(productSlug!),
    enabled: !!productSlug,
    staleTime: 1000 * 60 * 5,
  });
  
  // Fetch blog post data if we're on a blog post page
  const { data: blogPostData } = useQuery({
    queryKey: ['blog-post-for-breadcrumb', blogSlug],
    queryFn: () => fetchBlogPostBySlug(blogSlug!),
    enabled: !!blogSlug,
    staleTime: 1000 * 60 * 5,
  });
  
  // Generate hierarchical breadcrumbs based on route understanding
  const generateHierarchicalBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Category path mappings with proper hierarchy
    const categoryMappings: Record<string, { name: string; category: string }> = {
      '/riidest-kotid': { name: 'Riidest kotid', category: 'cotton_bag' },
      '/paberkotid': { name: 'Paberkotid', category: 'paper_bag' },
      '/nooriga-kotid': { name: 'Nööriga kotid', category: 'drawstring_bag' },
      '/sussikotid': { name: 'Sussikotid', category: 'shoebag' },
    };
    
    // Static page mappings
    const staticPageMappings: Record<string, string> = {
      '/tooted': 'Tooted',
      '/kontakt': 'Kontakt',
      '/meist': 'Meist',
      '/portfoolio': 'Portfoolio',
      '/blogi': 'Blogi',
    };
    
    // Handle product detail pages: Home → Tooted → Category → Product
    if (isProductDetail && productData) {
      // Add Tooted parent
      breadcrumbs.push({ label: 'Tooted', href: '/tooted' });
      
      // Add category based on product type
      const categoryPath = getCategoryPathFromProductType(productData.type);
      if (categoryPath) {
        const categoryInfo = categoryMappings[categoryPath];
        if (categoryInfo) {
          breadcrumbs.push({ label: categoryInfo.name, href: categoryPath });
        }
      }
      
      // Add product name (no href - current page)
      breadcrumbs.push({ label: productData.name });
      
    // Handle blog post pages: Home → Blogi → Post Title
    } else if (isBlogPost && blogPostData) {
      breadcrumbs.push({ label: 'Blogi', href: '/blogi' });
      breadcrumbs.push({ label: blogPostData.title });
      
    // Handle category pages: Home → Tooted → Category
    } else if (categoryMappings[path]) {
      breadcrumbs.push({ label: 'Tooted', href: '/tooted' });
      breadcrumbs.push({ label: categoryMappings[path].name });
      
    // Handle static pages: Home → Page
    } else if (staticPageMappings[path]) {
      breadcrumbs.push({ label: staticPageMappings[path] });
      
    // Fallback to URL-based breadcrumbs for unknown routes
    } else if (pathSegments.length > 0) {
      const urlToLabel: Record<string, string> = {
        'tooted': 'Tooted',
        'riidest-kotid': 'Riidest kotid',
        'paberkotid': 'Paberkotid',
        'nooriga-kotid': 'Nööriga kotid',
        'sussikotid': 'Sussikotid',
        'kontakt': 'Kontakt',
        'meist': 'Meist',
        'portfoolio': 'Portfoolio',
        'blogi': 'Blogi',
      };
      
      let currentPath = '';
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const label = urlToLabel[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
        
        breadcrumbs.push({
          label,
          href: index === pathSegments.length - 1 ? undefined : currentPath
        });
      });
    }
    
    return breadcrumbs;
  };
  
  // Helper function to get category path from product type
  const getCategoryPathFromProductType = (productType: string): string | null => {
    const typeToPath: Record<string, string> = {
      'cotton_bag': '/riidest-kotid',
      'paper_bag': '/paberkotid',
      'drawstring_bag': '/nooriga-kotid',
      'string_bag': '/nooriga-kotid',
      'shoe_bag': '/sussikotid',
      'shoebag': '/sussikotid',
    };
    
    return typeToPath[productType] || null;
  };
  
  const breadcrumbItems = items || generateHierarchicalBreadcrumbs();
  
  // Add structured data for breadcrumbs (preserve existing functionality)
  React.useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.label,
        "item": item.href ? `https://leatex.ee${item.href}` : undefined
      }))
    };
    
    // Remove any existing breadcrumb structured data
    const existingScript = document.querySelector('script[type="application/ld+json"][data-breadcrumbs="true"]');
    if (existingScript) {
      document.head.removeChild(existingScript);
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-breadcrumbs', 'true');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    return () => {
      const scriptToRemove = document.querySelector('script[type="application/ld+json"][data-breadcrumbs="true"]');
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove);
      }
    };
  }, [breadcrumbItems]);
  
  if (breadcrumbItems.length === 0) return null;
  
  return (
    <nav className={`flex items-center space-x-1 text-sm text-gray-600 ${className}`} aria-label="Breadcrumb">
      <Link 
        to="/" 
        className="flex items-center hover:text-primary transition-colors"
        aria-label="Avaleht"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium" aria-current="page">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
