import React, { useEffect, useRef } from 'react';
import ballImage from '../../imgs/ball.png';
import './Loader.css';

const Loader = () => {
  const ballRef = useRef(null);
  const shadowRef = useRef(null);
  
  // Use useEffect for Safari-specific animation optimizations
  useEffect(() => {
    // Check if running on Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isSafari && ballRef.current && shadowRef.current) {
      // Apply specific Safari optimizations
      ballRef.current.style.webkitTransform = 'translateZ(0)';
      shadowRef.current.style.webkitTransform = 'translateZ(0)';
      
      // Force GPU acceleration for Safari
      document.body.style.webkitPerspective = '1000px';
      document.body.style.webkitBackfaceVisibility = 'hidden';
    }
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-green-900 to-emerald-700 z-50">
      <div className="relative">
        {/* Separate animations for better Safari compatibility */}
        <div className="perspective-1000">
          <div className="animate-simple-bounce">
            <img 
              ref={ballRef}
              src={ballImage} 
              alt="Loading" 
              className="w-24 h-24 object-contain drop-shadow-glow-white safari-friendly-rotate"
            />
          </div>
        </div>
        
        {/* Dynamic shadow that follows the ball's position */}
        <div 
          ref={shadowRef}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/30 rounded-full blur-md animate-pulse safari-friendly-shadow"
        ></div>
      </div>
      
      {/* Stylized loading text */}
      <div className="absolute mt-36">
        <p className="text-white font-medium text-3xl tracking-wider">
          <span className="inline-block safari-friendly-pulse delay-0">ი</span>
          <span className="inline-block safari-friendly-pulse delay-100">ტ</span>
          <span className="inline-block safari-friendly-pulse delay-200">ვ</span>
          <span className="inline-block safari-friendly-pulse delay-300">ი</span>
          <span className="inline-block safari-friendly-pulse delay-400">რ</span>
          <span className="inline-block safari-friendly-pulse delay-500">თ</span>
          <span className="inline-block safari-friendly-pulse delay-600">ე</span>
          <span className="inline-block safari-friendly-pulse delay-700">ბ</span>
          <span className="inline-block safari-friendly-pulse delay-800">ა</span>
        </p>
      </div>
    </div>
  );
};

export default Loader;