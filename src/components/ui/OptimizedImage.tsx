
import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  quality?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = "",
  width,
  height,
  priority = false,
  fallbackSrc = "/placeholder.svg",
  onLoad,
  onError,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 85
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageRetryCount, setImageRetryCount] = useState(0);

  // Generate optimized image URLs
  const generateImageUrls = (originalSrc: string) => {
    if (!originalSrc || originalSrc.startsWith('data:') || originalSrc.startsWith('blob:')) {
      return { webp: originalSrc, jpeg: originalSrc };
    }

    // For external images, return original
    if (originalSrc.startsWith('http') && !originalSrc.includes('supabase')) {
      return { webp: originalSrc, jpeg: originalSrc };
    }

    // For Supabase images, add optimization parameters
    const baseUrl = originalSrc.split('?')[0];
    const webpUrl = `${baseUrl}?format=webp&quality=${quality}&width=${width || 800}`;
    const jpegUrl = `${baseUrl}?format=jpeg&quality=${quality}&width=${width || 800}`;
    
    return { webp: webpUrl, jpeg: jpegUrl };
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Update image source when in view
  useEffect(() => {
    if (isInView && src) {
      const urls = generateImageUrls(src);
      setCurrentSrc(urls.webp);
    }
  }, [isInView, src, quality, width]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    console.log(`Image failed to load: ${currentSrc}, retry count: ${imageRetryCount}`);
    
    if (imageRetryCount === 0 && currentSrc.includes('webp')) {
      // First retry: fallback to JPEG if WebP fails
      const urls = generateImageUrls(src);
      setCurrentSrc(urls.jpeg);
      setImageRetryCount(1);
    } else if (imageRetryCount === 1 && currentSrc !== fallbackSrc) {
      // Second retry: use fallback image
      setCurrentSrc(fallbackSrc);
      setImageRetryCount(2);
      setHasError(true);
    } else {
      // Final fallback
      setHasError(true);
    }
    
    onError?.();
  };

  if (!isInView && !priority) {
    return (
      <div 
        ref={imgRef}
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ 
          width: width ? `${width}px` : '100%', 
          height: height ? `${height}px` : '100%',
          aspectRatio: width && height ? `${width}/${height}` : undefined
        }}
        aria-label={alt}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <picture>
        {currentSrc.includes('webp') && (
          <source
            srcSet={currentSrc}
            type="image/webp"
            sizes={sizes}
          />
        )}
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } w-full h-full object-cover`}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            aspectRatio: width && height ? `${width}/${height}` : undefined
          }}
        />
      </picture>
      
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* Error state */}
      {hasError && currentSrc === fallbackSrc && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Pilt ei lae</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
