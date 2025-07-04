
import React, { useState, useRef, useEffect, useCallback } from 'react';

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
  quality = 50 // More aggressive compression
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageRetryCount, setImageRetryCount] = useState(0);

  // More aggressive image optimization
  const generateImageUrls = useCallback((originalSrc: string) => {
    if (!originalSrc || originalSrc.startsWith('data:') || originalSrc.startsWith('blob:')) {
      return { webp: originalSrc, jpeg: originalSrc };
    }

    if (originalSrc.startsWith('http') && !originalSrc.includes('supabase')) {
      return { webp: originalSrc, jpeg: originalSrc };
    }

    const baseUrl = originalSrc.split('?')[0];
    const targetWidth = width || 300; // Smaller default size
    const webpUrl = `${baseUrl}?format=webp&quality=${quality}&width=${targetWidth}&resize=cover&optimize=true&progressive=true`;
    const jpegUrl = `${baseUrl}?format=jpeg&quality=${quality}&width=${targetWidth}&resize=cover&optimize=true&progressive=true`;
    
    return { webp: webpUrl, jpeg: jpegUrl };
  }, [quality, width]);

  // Optimized Intersection Observer
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
        rootMargin: '20px 0px',
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (isInView && src) {
      const urls = generateImageUrls(src);
      setCurrentSrc(urls.webp);
    }
  }, [isInView, src, generateImageUrls]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (imageRetryCount === 0 && currentSrc.includes('webp')) {
      const urls = generateImageUrls(src);
      setCurrentSrc(urls.jpeg);
      setImageRetryCount(1);
    } else if (imageRetryCount === 1 && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setImageRetryCount(2);
      setHasError(true);
    } else {
      setHasError(true);
    }
    onError?.();
  }, [imageRetryCount, currentSrc, fallbackSrc, generateImageUrls, src, onError]);

  if (!isInView && !priority) {
    return (
      <div 
        ref={imgRef}
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ 
          width: width ? `${width}px` : '100%', 
          height: height ? `${height}px` : '200px',
          aspectRatio: width && height ? `${width}/${height}` : '16/9'
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
          className={`transition-opacity duration-200 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } w-full h-full object-cover`}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            aspectRatio: width && height ? `${width}/${height}` : '16/9'
          }}
        />
      </picture>
      
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {hasError && currentSrc === fallbackSrc && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Pilt ei lae</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
