
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useBreadcrumbData } from '@/hooks/useBreadcrumbData';
import { BreadcrumbItem } from '@/types/breadcrumb';

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = "" }) => {
  const { context, loading, categoryDisplayNames } = useBreadcrumbData();
  
  // Generate breadcrumbs based on context
  const generatedBreadcrumbs = useMemo((): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];
    
    switch (context.pageType) {
      case 'home':
        return [];
        
      case 'products':
        breadcrumbs.push({ label: 'Tooted', href: '/tooted' });
        if (context.categoryId && categoryDisplayNames[context.categoryId]) {
          breadcrumbs.push({ 
            label: categoryDisplayNames[context.categoryId], 
            isCurrentPage: true 
          });
        }
        break;
        
      case 'product-detail':
        breadcrumbs.push({ label: 'Tooted', href: '/tooted' });
        if (context.productData) {
          const categoryName = categoryDisplayNames[context.productData.type];
          if (categoryName) {
            const categoryPath = Object.keys(categoryDisplayNames).find(
              key => categoryDisplayNames[key] === categoryName
            );
            if (categoryPath) {
              const categoryUrl = Object.entries({
                'cotton_bag': '/riidest-kotid',
                'paper_bag': '/paberkotid',
                'drawstring_bag': '/nooriga-kotid',
                'shoebag': '/sussikotid',
              }).find(([key]) => key === categoryPath)?.[1];
              
              if (categoryUrl) {
                breadcrumbs.push({ label: categoryName, href: categoryUrl });
              }
            }
          }
          breadcrumbs.push({ 
            label: context.productData.name, 
            isCurrentPage: true 
          });
        }
        break;
        
      case 'blog':
        breadcrumbs.push({ label: 'Blogi', isCurrentPage: true });
        break;
        
      case 'blog-post':
        breadcrumbs.push({ label: 'Blogi', href: '/blogi' });
        if (context.blogPostData) {
          breadcrumbs.push({ 
            label: context.blogPostData.title, 
            isCurrentPage: true 
          });
        }
        break;
        
      case 'static':
        // Handle static pages with Estonian labels
        const staticPageLabels: Record<string, string> = {
          '/meist': 'Meist',
          '/kontakt': 'Kontakt',
          '/portfoolio': 'Portfoolio',
        };
        
        const currentPath = window.location.pathname;
        const pageLabel = staticPageLabels[currentPath];
        if (pageLabel) {
          breadcrumbs.push({ label: pageLabel, isCurrentPage: true });
        }
        break;
    }
    
    return breadcrumbs;
  }, [context, categoryDisplayNames]);

  // Use provided items or generated breadcrumbs
  const breadcrumbItems = items || generatedBreadcrumbs;
  
  // Generate structured data for SEO
  React.useEffect(() => {
    if (breadcrumbItems.length === 0) return;
    
    // Remove any existing breadcrumb structured data
    const existingScript = document.querySelector('script[data-breadcrumb-structured-data]');
    if (existingScript) {
      existingScript.remove();
    }
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Avaleht",
          "item": "https://leatex.ee"
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
    
    return () => {
      const scriptToRemove = document.querySelector('script[data-breadcrumb-structured-data]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [breadcrumbItems]);
  
  // Don't render if no breadcrumbs or if loading critical data
  if (breadcrumbItems.length === 0 || (loading && (context.pageType === 'product-detail' || context.pageType === 'blog-post'))) {
    return loading ? (
      <nav className={`flex items-center space-x-1 text-sm text-gray-600 ${className}`} aria-label="Breadcrumb">
        <div className="flex items-center space-x-1">
          <Home className="h-4 w-4" />
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </nav>
    ) : null;
  }
  
  return (
    <nav className={`flex items-center space-x-1 text-sm text-gray-600 ${className}`} aria-label="Navigatsioon">
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
          {item.href && !item.isCurrentPage ? (
            <Link
              to={item.href}
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span 
              className="text-gray-900 font-bold" 
              aria-current={item.isCurrentPage ? "page" : undefined}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
