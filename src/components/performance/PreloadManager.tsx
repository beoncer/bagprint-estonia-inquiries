
import { useEffect } from 'react';

const PreloadManager = () => {
  useEffect(() => {
    // Only preload absolute essentials
    const preloadResource = (href: string, as: string, type?: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      if (as === 'font') link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };

    // Preload only critical font
    preloadResource('/fonts/FixelDisplay-Regular.woff2', 'font', 'font/woff2');
    
    // DNS prefetch only for Supabase
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = '//ixotpxliaerkzjznyipi.supabase.co';
    document.head.appendChild(link);
    
  }, []);

  return null;
};

export default PreloadManager;
