import { useState, useEffect, useRef } from 'react';

function OptimizedImage({ 
  src, 
  alt, 
  className = '', 
  style = {}, 
  blurDataURL = null,
  priority = false,
  onLoad = null 
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    
    // Configure image loading options
    img.decoding = 'async';
    img.loading = priority ? 'eager' : 'lazy';
    
    img.onload = () => {
      setLoaded(true);
      onLoad?.(true);
    };
    
    img.onerror = () => {
      setError(true);
      onLoad?.(false);
    };
    
    img.src = src;

    // Preload the image
    if (imgRef.current && !imgRef.current.complete) {
      imgRef.current.src = src;
    }
  }, [src, priority, onLoad]);

  const baseStyles = {
    transition: 'all 0.3s ease-in-out',
    ...style
  };

  if (error) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={baseStyles}
      >
        <span className="text-gray-500">🏈</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={baseStyles}>
      {/* Blur placeholder */}
      {blurDataURL && !loaded && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
          style={{ zIndex: 1 }}
        />
      )}
      
      {/* Main image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          zIndex: 2,
          position: loaded ? 'relative' : 'absolute',
          inset: loaded ? 'auto' : '0'
        }}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
      
      {/* Loading spinner */}
      {!loaded && !error && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100"
          style={{ zIndex: blurDataURL ? 0 : 3 }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      )}
    </div>
  );
}

export default OptimizedImage;
