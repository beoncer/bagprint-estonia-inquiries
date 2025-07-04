
import React, { useState, useRef, useEffect } from 'react';

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setZoomPosition({ x, y });
  };

  return (
    <div className="relative overflow-hidden">
      <div
        ref={imageRef}
        className={`relative cursor-zoom-in overflow-hidden rounded-lg bg-gray-100 ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-500 ease-out ${
            isHovered ? 'scale-300' : 'scale-100'
          }`}
          style={{
            transformOrigin: isHovered ? `${zoomPosition.x}% ${zoomPosition.y}%` : 'center center'
          }}
        />
        
        {/* Zoom indicator */}
        {isHovered && (
          <div 
            className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none animate-pulse"
            style={{
              left: mousePosition.x - 8,
              top: mousePosition.y - 8,
              transform: 'translate(-50%, -50%)'
            }}
          />
        )}
      </div>
      
      {/* Zoom instruction */}
      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Hover to zoom
      </div>
    </div>
  );
};

export default ImageZoom;
