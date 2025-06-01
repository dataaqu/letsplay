import { useState, useEffect, useRef } from 'react';
import ballImage from '../../imgs/ball.png';
import './ImageLoadingScreen.css';

function ImageLoadingScreen({ onLoadComplete, children }) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const hasStarted = useRef(false);
  const onLoadCompleteRef = useRef();

  // Keep the callback reference updated
  useEffect(() => {
    onLoadCompleteRef.current = onLoadComplete;
  }, [onLoadComplete]);

  useEffect(() => {
    // Prevent multiple executions
    if (hasStarted.current) return;
    hasStarted.current = true;

    console.log('🎯 Loading screen started');

    const simulateLoading = async () => {
      const steps = [0, 20, 40, 60, 80, 100];
      
      for (let i = 0; i < steps.length; i++) {
        console.log(`📊 Progress: ${steps[i]}%`);
        setLoadingProgress(steps[i]);
        
        // Wait between steps
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      console.log('✅ Loading complete!');
      
      // Small delay before finishing
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setIsLoading(false);
      onLoadCompleteRef.current?.();
    };

    simulateLoading();
  }, []); // Empty dependency array - no dependencies needed

  if (!isLoading) {
    return children;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Bouncing Ball Animation */}
        <div className="mb-12">
          <div className="relative perspective-1000">
            <img 
              src={ballImage} 
              alt="Loading" 
              className="w-20 h-20 object-contain mx-auto bouncing-ball ball-glow"
            />
            {/* Shadow */}
            <div className="w-16 h-4 bg-black/30 rounded-full mx-auto mt-2 bouncing-shadow blur-sm"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 bg-white/20 rounded-full h-3 mb-6 backdrop-blur-sm shadow-lg">
          <div 
            className="bg-gradient-to-r from-white to-green-100 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>

        {/* Progress Text */}
        <div className="text-white/90 text-lg font-medium mb-8">
          {loadingProgress}%
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}

export default ImageLoadingScreen;