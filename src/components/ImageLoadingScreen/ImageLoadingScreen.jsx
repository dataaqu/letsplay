import { useState, useEffect, useCallback } from 'react';
import imagePreloader from '../../utils/imagePreloader';
import ballImage from '../../imgs/ball.png';
import './ImageLoadingScreen.css';

function ImageLoadingScreen({ onLoadComplete, children }) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStartedLoading, setHasStartedLoading] = useState(false);

  // Memoize the onLoadComplete callback to prevent unnecessary re-renders
  const memoizedOnLoadComplete = useCallback(() => {
    onLoadComplete?.();
  }, [onLoadComplete]);

  useEffect(() => {
    // Prevent multiple loading attempts
    if (hasStartedLoading) return;
    
    let mounted = true;
    setHasStartedLoading(true);
    
    const loadImages = async () => {
      try {
        // Simulate progress updates - 5 stages for smoother loading
        const progressSteps = [
          { progress: 20 },
          { progress: 40 },
          { progress: 60 },
          { progress: 80 },
          { progress: 100 }
        ];

        // Load critical images first
        await imagePreloader.preloadCriticalImages();
        
        if (!mounted) return;

        // Update progress with smooth animation
        for (const step of progressSteps) {
          if (!mounted) return;
          
          setLoadingProgress(step.progress);
          
          // Shorter delay for smoother progression
          await new Promise(resolve => setTimeout(resolve, 250));
        }

        // Load secondary images in background
        imagePreloader.preloadSecondaryImages();        if (mounted) {
          setTimeout(() => {
            setIsLoading(false);
            memoizedOnLoadComplete();
          }, 500);
        }
      } catch (error) {
        console.error('Error loading images:', error);
        if (mounted) {
          // Even if images fail, show the app
          setIsLoading(false);
          memoizedOnLoadComplete();
        }
      }
    };

    loadImages();
    return () => {
      mounted = false;
    };
  }, [hasStartedLoading, memoizedOnLoadComplete]); // Include dependencies

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
