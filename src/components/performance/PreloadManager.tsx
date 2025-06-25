
import { useEffect } from 'react';

const PreloadManager = () => {
  useEffect(() => {
    // Only preload critical resources for first paint
    const preloadResource = (href: string, as: string, type?: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      if (as === 'font') link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };

    // Preload only critical fonts
    preloadResource('/fonts/FixelDisplay-Regular.woff2', 'font', 'font/woff2');
    
    // Preload only critical images (reduce list)
    const criticalImages = ['/logo.png'];
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    // DNS prefetch for external resources
    const dnsPrefetch = (domain: string) => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    };

    dnsPrefetch('//ixotpxliaerkzjznyipi.supabase.co');
    
    // Remove Google Fonts prefetch as it's not being used
  }, []);

  return null;
};

export default PreloadManager;
