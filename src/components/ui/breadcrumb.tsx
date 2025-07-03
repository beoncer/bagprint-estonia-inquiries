
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
  productData?: {
    name: string;
    category: string;
  };
  blogPostTitle?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  items, 
  className = "", 
  productData,
  blogPostTitle 
}) => {
  const location = useLocation();
  
  // Category mapping for Estonian labels
  const categoryLabels: Record<string, string> = {
    'cotton_bag': 'Riidest kotid',
    'paper_bag': 'Paberkotid', 
    'drawstring_bag': 'Nööriga kotid',
    'shoebag': 'Sussikotid',
    'packaging': 'E-poe pakendid'
  };

  const categoryRoutes: Record<string, string> = {
    '/riidest-kotid': 'cotton_bag',
    '/paberkotid': 'paper_bag',
    '/nooriga-kotid': 'drawstring_bag',
    '/sussikotid': 'shoebag'
  };

  // Generate hierarchical breadcrumbs based on site structure
  const generateHierarchicalBreadcrumbs = (): BreadcrumbItem[] => {
    const path = location.pathname;
    const breadcrumbs: BreadcrumbItem[] = [];
    
    // Homepage - no breadcrumbs
    if (path === '/') {
      return [];
    }
    
    // Products main page
    if (path === '/tooted') {
      breadcrumbs.push({ label: 'Tooted' });
      return breadcrumbs;
    }
    
    // Product category pages
    if (categoryRoutes[path]) {
      breadcrumbs.push({ label: 'Tooted', href: '/tooted' });
      const categoryKey = categoryRoutes[path];
      breadcrumbs.push({ label: categoryLabels[categoryKey] || categoryKey });
      return breadcrumbs;
    }
    
    // Product detail pages (with product data)
    if (path.startsWith('/tooted/') && productData) {
      breadcrumbs.push({ label: 'Tooted', href: '/tooted' });
      
      // Add category if available
      if (productData.category && categoryLabels[productData.category]) {
        const categoryRoute = Object.keys(categoryRoutes).find(
          route => categoryRoutes[route] === productData.category
        );
        if (categoryRoute) {
          breadcrumbs.push({ 
            label: categoryLabels[productData.category], 
            href: categoryRoute 
          });
        }
      }
      
      breadcrumbs.push({ label: productData.name });
      return breadcrumbs;
    }
    
    // Blog post pages
    if (path.startsWith('/blogi/') && blogPostTitle) {
      breadcrumbs.push({ label: 'Blogi', href: '/blogi' });
      breadcrumbs.push({ label: blogPostTitle });
      return breadcrumbs;
    }
    
    // Blog main page
    if (path === '/blogi') {
      breadcrumbs.push({ label: 'Blogi' });
      return breadcrumbs;
    }
    
    // Static pages
    const staticPages: Record<string, string> = {
      '/meist': 'Meist',
      '/kontakt': 'Kontakt',
      '/portfoolio': 'Portfoolio'
    };
    
    if (staticPages[path]) {
      breadcrumbs.push({ label: staticPages[path] });
      return breadcrumbs;
    }
    
    // 404 or unknown pages
    if (path.includes('404') || !Object.keys(staticPages).includes(path)) {
      breadcrumbs.push({ label: '404' });
      return breadcrumbs;
    }
    
    // Fallback for other pages
    const segments = path.split('/').filter(Boolean);
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      const label = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
      breadcrumbs.push({ label });
    }
    
    return breadcrumbs;
  };
  
  const breadcrumbItems = items || generateHierarchicalBreadcrumbs();
  
  // Add structured data for breadcrumbs
  React.useEffect(() => {
    // Remove existing breadcrumb structured data
    const existingScript = document.querySelector('script[data-breadcrumb-structured-data]');
    if (existingScript) {
      existingScript.remove();
    }

    if (breadcrumbItems.length > 0) {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Avaleht",
            "item": "https://leatex.ee/"
          },
          ...breadcrumbItems.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 2,
            "name": item.label,
            "item": item.href ? `https://leatex.ee${item.href}` : undefined
          }))
        ]
      };
      
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-breadcrumb-structured-data', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
    
    return () => {
      const scriptToRemove = document.querySelector('script[data-breadcrumb-structured-data]');
      if (scriptToRemove) {
        scriptToRemove.remove();
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
        <React.Fragment key={index}>
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
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
