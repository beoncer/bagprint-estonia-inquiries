import React, { useState, useRef, useCallback, useEffect } from 'react';

interface MagnifyingGlassProps {
  src: string;
  alt: string;
  zoomLevel?: number;
  lensSize?: number;
  className?: string;
}

const MagnifyingGlass: React.FC<MagnifyingGlassProps> = ({
  src,
  alt,
  zoomLevel = 3,
  lensSize = 150,
  className = ""
}) => {
  const [isActive, setIsActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    setIsActive(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsActive(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !imageRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  }, []);

  const getBackgroundPosition = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return '0% 0%';

    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate the percentage position within the image for magnification
    const xPercent = (mousePosition.x / rect.width) * 100;
    const yPercent = (mousePosition.y / rect.height) * 100;

    return `${xPercent}% ${yPercent}%`;
  }, [mousePosition]);

  const getContainerDimensions = useCallback(() => {
    if (!containerRef.current) return { width: 0, height: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }, []);

  // Load high-resolution version for zooming
  const highResSrc = src.includes('?') 
    ? src.replace(/quality=\d+/, 'quality=100').replace(/width=\d+/, 'width=1200')
    : src;

  const lensStyle = {
    width: `${lensSize}px`,
    height: `${lensSize}px`,
    left: `${mousePosition.x - lensSize / 2}px`,
    top: `${mousePosition.y - lensSize / 2}px`,
    backgroundImage: `url(${highResSrc})`,
    backgroundSize: `${getContainerDimensions().width * zoomLevel}px ${getContainerDimensions().height * zoomLevel}px`,
    backgroundPosition: getBackgroundPosition(),
    backgroundRepeat: 'no-repeat',
  };

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = highResSrc;
  }, [highResSrc]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-crosshair ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        draggable={false}
      />

      {/* Magnifying glass lens */}
      {isActive && imageLoaded && (
        <div
          className="absolute pointer-events-none border-4 border-white rounded-full shadow-lg z-10"
          style={lensStyle}
        >
          {/* Inner border for better definition */}
          <div className="absolute inset-1 rounded-full border border-gray-300 opacity-50" />
        </div>
      )}

      {/* Zoom indicator */}
      {!isActive && (
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
          🔍 Hover to zoom
        </div>
      )}
    </div>
  );
};

export default MagnifyingGlass;