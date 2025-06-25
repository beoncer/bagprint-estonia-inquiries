
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
  width = 400, // Set default width
  height = 300, // Set default height
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

  // Ultra-aggressive image optimization for better LCP
  const generateImageUrls = (originalSrc: string) => {
    if (!originalSrc || originalSrc.startsWith('data:') || originalSrc.startsWith('blob:')) {
      return { webp: originalSrc, avif: originalSrc, jpeg: originalSrc };
    }

    if (originalSrc.startsWith('http') && !originalSrc.includes('supabase')) {
      return { webp: originalSrc, avif: originalSrc, jpeg: originalSrc };
    }

    const baseUrl = originalSrc.split('?')[0];
    const targetWidth = Math.min(width || 400, 800); // Cap max width
    
    // Generate multiple formats for better compression
    const avifUrl = `${baseUrl}?format=avif&quality=${quality - 10}&width=${targetWidth}&resize=cover&optimize=true`;
    const webpUrl = `${baseUrl}?format=webp&quality=${quality}&width=${targetWidth}&resize=cover&optimize=true`;
    const jpegUrl = `${baseUrl}?format=jpeg&quality=${quality + 5}&width=${targetWidth}&resize=cover&optimize=true`;
    
    return { avif: avifUrl, webp: webpUrl, jpeg: jpegUrl };
  };

  // More efficient intersection observer with smaller root margin
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
        rootMargin: '50px 0px', // Preload just before visible
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
      // Try AVIF first for best compression
      setCurrentSrc(urls.avif);
    }
  }, [isInView, src, quality, width, height]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    if (imageRetryCount === 0 && currentSrc.includes('avif')) {
      const urls = generateImageUrls(src);
      setCurrentSrc(urls.webp);
      setImageRetryCount(1);
    } else if (imageRetryCount === 1 && currentSrc.includes('webp')) {
      const urls = generateImageUrls(src);
      setCurrentSrc(urls.jpeg);
      setImageRetryCount(2);
    } else if (imageRetryCount === 2 && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setImageRetryCount(3);
      setHasError(true);
    } else {
      setHasError(true);
    }
    onError?.();
  };

  // Render placeholder with explicit dimensions to prevent layout shift
  if (!isInView && !priority) {
    return (
      <div 
        ref={imgRef}
        className={`bg-gray-200 ${className}`}
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          aspectRatio: `${width}/${height}`
        }}
        aria-label={alt}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <picture>
        {currentSrc.includes('avif') && (
          <source
            srcSet={currentSrc}
            type="image/avif"
            sizes={sizes}
          />
        )}
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
          className={`transition-opacity duration-150 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } w-full h-full object-cover`}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            aspectRatio: `${width}/${height}`,
            width: '100%',
            height: 'auto'
          }}
        />
      </picture>
      
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gray-200"
          style={{ 
            width: `${width}px`, 
            height: `${height}px` 
          }}
        />
      )}
      
      {hasError && currentSrc === fallbackSrc && (
        <div 
          className="absolute inset-0 bg-gray-100 flex items-center justify-center"
          style={{ 
            width: `${width}px`, 
            height: `${height}px` 
          }}
        >
          <span className="text-gray-400 text-sm">Pilt ei lae</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
