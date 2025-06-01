import { useState, useEffect, useRef } from 'react';
import imagePreloader from '../../utils/imagePreloader';
import ballImage from '../../imgs/ball.png';
import './ImageLoadingScreen.css';

function ImageLoadingScreen({ onLoadComplete, children }) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const hasStartedLoadingRef = useRef(false);
  const onLoadCompleteRef = useRef();

  // Keep the callback reference updated
  useEffect(() => {
    onLoadCompleteRef.current = onLoadComplete;
  }, [onLoadComplete]);

  useEffect(() => {
    // Prevent multiple loading attempts
    if (hasStartedLoadingRef.current) return;
    
    let mounted = true;
    hasStartedLoadingRef.current = true;
    
    // Fallback timer - ensure loading screen never gets stuck
    const fallbackTimer = setTimeout(() => {
      if (mounted) {
        console.log('Fallback timer triggered - showing app');
        setIsLoading(false);
        onLoadCompleteRef.current?.();
      }
    }, 5000); // 5 second maximum loading time
    
    const loadImages = async () => {
      try {
        console.log('Starting image loading...');
        
        // Simulate progress updates - 5 stages for smoother loading
        const progressSteps = [
          { progress: 20 },
          { progress: 40 },
          { progress: 60 },
          { progress: 80 },
          { progress: 100 }
        ];

        // Try to load critical images with timeout
        try {
          const criticalLoaded = await Promise.race([
            imagePreloader.preloadCriticalImages(),
            new Promise(resolve => setTimeout(() => resolve(false), 2000))
          ]);
          console.log('Critical images loaded:', criticalLoaded);
        } catch (imageError) {
          console.warn('Image preloading failed, continuing anyway:', imageError);
        }
        
        if (!mounted) return;

        // Update progress with smooth animation
        for (const step of progressSteps) {
          if (!mounted) return;
          
          console.log(`Progress: ${step.progress}%`);
          setLoadingProgress(step.progress);
          
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        // Load secondary images in background
        try {
          imagePreloader.preloadSecondaryImages();
        } catch (error) {
          console.warn('Secondary images failed:', error);
        }

        if (mounted) {
          console.log('Loading complete, showing app...');
          clearTimeout(fallbackTimer);
          setTimeout(() => {
            setIsLoading(false);
            onLoadCompleteRef.current?.();
          }, 300);
        }
      } catch (error) {
        console.error('Error in loading process:', error);
        if (mounted) {
          console.log('Error occurred, showing app anyway...');
          clearTimeout(fallbackTimer);
          setIsLoading(false);
          onLoadCompleteRef.current?.();
        }
      }
    };

    console.log('ImageLoadingScreen: Starting load process...');
    loadImages();
    
    return () => {
      mounted = false;
      clearTimeout(fallbackTimer);
    };
  }, []); // Empty dependency array - run only once

  if (!isLoading) {
    return children;
  }
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex items-center justify-center z-50">
      <div className="text-center">        {/* Bouncing Ball Animation */}
        <div className="mb-12">
          <div className="relative perspective-1000">
            <img 
              src={ballImage} 
              alt="Loading" 
              className="w-20 h-20 object-contain mx-auto bouncing-ball ball-glow"
            />
            
            {/* Dynamic shadow that follows the ball's position */}
            <div className="absolute -bottom-2 left-1/2 w-12 h-3 bg-black/40 rounded-full blur-sm ball-shadow" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 mx-auto mb-8">
          <div className="bg-green-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>        {/* Loading Animation - Enhanced dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-white rounded-full loading-dot"
              style={{
                animationDelay: `${i * 0.3}s`,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageLoadingScreen;
