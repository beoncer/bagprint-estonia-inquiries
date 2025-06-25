
import { useEffect } from 'react';

const PreloadManager = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadResource = (href: string, as: string, type?: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      if (as === 'font') link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };

    // Preload critical fonts
    preloadResource('/fonts/FixelDisplay-Regular.woff2', 'font', 'font/woff2');
    
    // Preload hero images (if any)
    const heroImages = ['/hero-bg.jpg', '/logo.png'];
    heroImages.forEach(src => {
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
    dnsPrefetch('//fonts.googleapis.com');
  }, []);

  return null;
};

export default PreloadManager;
