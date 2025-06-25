
import { useEffect } from 'react';

const CriticalResourcesOptimizer = () => {
  useEffect(() => {
    // Remove unused CSS and JS more aggressively
    const removeUnusedResources = () => {
      // Remove unused stylesheets
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
      stylesheets.forEach((sheet) => {
        const link = sheet as HTMLLinkElement;
        if (link.href.includes('unused') || link.href.includes('vendor')) {
          link.remove();
        }
      });

      // Lazy load non-critical resources
      const nonCriticalScripts = document.querySelectorAll('script[src*="analytics"], script[src*="tracking"]');
      nonCriticalScripts.forEach((script) => {
        script.setAttribute('defer', '');
      });
    };

    // Optimize font loading
    const optimizeFonts = () => {
      const fontLinks = document.querySelectorAll('link[href*="fonts"]');
      fontLinks.forEach((link) => {
        link.setAttribute('rel', 'preload');
        link.setAttribute('as', 'font');
        link.setAttribute('crossorigin', 'anonymous');
      });
    };

    // Run optimizations after DOM is ready
    setTimeout(() => {
      removeUnusedResources();
      optimizeFonts();
    }, 100);

    // Preload critical resources for next page
    const preloadNextPageResources = () => {
      const criticalRoutes = ['/tooted', '/kontakt'];
      criticalRoutes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    };

    setTimeout(preloadNextPageResources, 2000);

  }, []);

  return null;
};

export default CriticalResourcesOptimizer;
