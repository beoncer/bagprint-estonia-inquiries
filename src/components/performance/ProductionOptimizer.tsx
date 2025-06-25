
import { useEffect } from 'react';

const ProductionOptimizer = () => {
  useEffect(() => {
    // Remove console logs in production
    if (import.meta.env.PROD) {
      console.log = () => {};
      console.warn = () => {};
      console.info = () => {};
    }

    // Optimize images on the fly
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.loading) {
          img.loading = 'lazy';
        }
        if (!img.decoding) {
          img.decoding = 'async';
        }
      });
    };

    // Run optimization after DOM is ready
    setTimeout(optimizeImages, 100);

    // Intersection Observer for better lazy loading
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });

    return () => {
      imageObserver.disconnect();
    };
  }, []);

  return null;
};

export default ProductionOptimizer;
