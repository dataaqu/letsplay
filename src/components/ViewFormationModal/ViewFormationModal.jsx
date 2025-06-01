import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';
import pitchImage from '../../imgs/pitch.jpg';
import pitch2Image from '../../imgs/pitch2.jpg';
import glovesImage from '../../imgs/gloves.png';
import shirtImage from '../../imgs/shirt.png';
import shirt2Image from '../../imgs/shirt2.png';
import './ViewFormationModal.css';

function ViewFormationModal({ isOpen, onClose, team1Players, team2Players, matchData }) {
  const [isClosing, setIsClosing] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Changed threshold and logic
  const modalContentRef = useRef(null);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  useEffect(() => {
    
    // Set initial mobile state
    const checkMobile = () => {
      const width = window.innerWidth;
      const isMobileDevice = width <= 768 || /Mobi|Android/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    
    if (isOpen) {
      setIsClosing(false);
      document.body.style.overflow = 'hidden';
      
      // Handle screen size changes
      const handleResize = () => {
        checkMobile();
      };
      
      window.addEventListener('resize', handleResize);
      
      // Preload images for better rendering
      const preloadImages = async () => {
        const images = [pitchImage, pitch2Image, glovesImage, shirtImage, shirt2Image];
        const preloadPromises = images.map(src => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = reject;
          });
        });
        
        try {
          await Promise.all(preloadPromises);
        } catch (error) {
          console.error('Failed to preload images:', error);
        }
      };
      
      preloadImages();
      
      // Cleanup function
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('resize', handleResize);
      };
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };
  
  // Touch handlers for swipe gestures
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };
  
  const handleTouchMove = (e) => {
    touchEndY.current = e.touches[0].clientY;
    
    if (modalContentRef.current && window.innerWidth < 640) {
      const distance = touchEndY.current - touchStartY.current;
      if (distance > 0) {
        const translateValue = Math.min(distance * 0.4, 150);
        modalContentRef.current.style.transform = `translateY(${translateValue}px)`;
        modalContentRef.current.style.webkitTransform = `translateY(${translateValue}px)`;
        modalContentRef.current.style.opacity = `${1 - Math.min(distance * 0.002, 0.3)}`;
      }
    }
  };
  
  const handleTouchEnd = () => {
    if (touchEndY.current - touchStartY.current > 100) {
      // If swiped down more than 100px, close the modal
      handleClose();
    } else if (modalContentRef.current) {
      // Reset the transform if not closing
      modalContentRef.current.style.transform = '';
      modalContentRef.current.style.webkitTransform = '';
      modalContentRef.current.style.opacity = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${
      isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
    }`}>
      {/* Dark overlay */}
      <div 
        className="absolute inset-0 backdrop-blur-[2px] transition-opacity duration-200"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative w-[95%] md:w-5/6 h-[80vh] rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 modal-content ${
          isClosing ? 'animate-slideOut opacity-0 translate-y-4' : 'animate-slideIn opacity-100 translate-y-0'
        }`}
        onClick={e => e.stopPropagation()}
        ref={modalContentRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background Image Container */}
        <div className="absolute inset-0 bg-emerald-900 transition-transform duration-500 overflow-hidden pitch-background-container">
          {/* Pitch Image */}
          <div 
            className="pitch-background transition-all duration-300 mix-blend-soft-light filter contrast-125 brightness-110 transform-gpu portrait-mode"
            style={{ 
              backgroundImage: `url(${isMobile ? pitch2Image : pitchImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        
          
          {/* Background Pattern Overlay */}
          <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(255,255,255,0.2)_3px,rgba(255,255,255,0.2)_6px)]" />
        </div>
        
        {/* Gradient overlays for depth */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-4 sm:p-8 h-full flex flex-col">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white px-3 py-2 transition-all duration-200 z-30"
            title="Close"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Formation Grid */}
          <div className="h-full grid grid-cols-6 grid-rows-3 gap-4 items-center formation-grid portrait-grid">
            {/* Team 1 Players */}
            {/* GK - row 1, col 2 */}
            {team1Players?.[0] && (
              <div className="col-start-1 row-start-2 flex flex-col items-center mobile-grid-item" data-mobile-pos="1,2">
                <img 
                  src={glovesImage} 
                  alt="Team 1 Goalkeeper"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain opacity-90"
                />
                <span className="text-white text-lg font-medium mt-1">
                  {team1Players[0]}
                </span>
              </div>
            )}

            {/* Player 1 - row 2, col 1 */}
            {team1Players?.[1] && (
              <div className="col-start-2 row-start-1 flex flex-col items-center mobile-grid-item" data-mobile-pos="2,1">
                <img 
                  src={shirtImage} 
                  alt="Team 1 Player 1"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain opacity-90 filter invert-[0.2] hue-rotate-170"
                />
                <span className="text-white text-lg font-medium mt-1">
                  {team1Players[1]}
                </span>
              </div>
            )}

            {/* Player 2 - row 2, col 3 */}
            {team1Players?.[2] && (
              <div className="col-start-2 row-start-3 flex flex-col items-center mobile-grid-item" data-mobile-pos="2,3">
                <img 
                  src={shirtImage} 
                  alt="Team 1 Player 2"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain opacity-90 filter invert-[0.2] hue-rotate-170"
                />
                <span className="text-white text-lg font-medium mt-1">
                  {team1Players[2]}
                </span>
              </div>
            )}

            {/* Player 3 - row 3, col 1 */}
            {team1Players?.[3] && (
              <div className="col-start-3 row-start-1 flex flex-col items-center mobile-grid-item" data-mobile-pos="3,1">
                <img 
                  src={shirtImage} 
                  alt="Team 1 Player 3"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain opacity-90 filter invert-[0.2] hue-rotate-170"
                />
                <span className="text-white text-lg font-medium mt-1">
                  {team1Players[3]}
                </span>
              </div>
            )}

            {/* Player 4 - row 3, col 3 */}
            {team1Players?.[4] && (
              <div className="col-start-3 row-start-3 flex flex-col items-center mobile-grid-item" data-mobile-pos="3,3">
                <img 
                  src={shirtImage} 
                  alt="Team 1 Player 4"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain opacity-90 filter invert-[0.2] hue-rotate-170"
                />
                <span className="text-white text-lg font-medium mt-1">
                  {team1Players[4]}
                </span>
              </div>
            )}

            {/* Sixth Player - keep original desktop position */}
            {team1Players?.[5] && (
              <div className="col-start-2 row-start-2 flex flex-col items-center mobile-grid-item" data-mobile-pos="1,2">
                <img 
                  src={shirtImage} 
                  alt="Team 1 Player 6"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain opacity-90 filter invert-[0.2] hue-rotate-170"
                />
                <span className="text-white text-lg font-medium mt-1">
                  {team1Players[5]}
                </span>
              </div>
            )}

            {/* Team 2 Players */}
            {/* Player 1 - row 4, col 1 */}
            {team2Players?.[1] && (
              <div className="col-start-5 row-start-1 flex flex-col items-center mobile-grid-item" data-mobile-pos="4,1">
                <img 
                  src={shirt2Image} 
                  alt="Team 2 Player 1"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain opacity-90"
                />
                <span className="text-white text-lg font-medium mt-1">
                  {team2Players[1]}
                </span>
              </div>
            )}

            {/* Player 2 - row 4, col 3 */}
            {team2Players?.[2] && (
              <div className="col-start-5 row-start-3 flex flex-col items-center mobile-grid-item" data-mobile-pos="4,3">
                <img 
                  src={shirt2Image} 
                  alt="Team 2 Player 2"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain opacity-90"
                />
                <span className="text-white text-lg font-medium mt-1">
                  {team2Players[2]}
                </span>
              </div>
            )}

            {/* Player 3 - row 5, col 1 */}
            {team2Players?.[3] && (
              <div className="col-start-4 row-start-1 flex flex-col items-center mobile-grid-item" data-mobile-pos="5,1">
                <img 
                  src={shirt2Image} 
                  alt="Team 2 Player 3"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain opacity-90"
                />
                <span className="text-white text-lg font-medium mt-1">
                  {team2Players[3]}
                </span>
              </div>
            )}

            {/* Player 4 - row 5, col 3 */}
            {team2Players?.[4] && (
              <div className="col-start-4 row-start-3 flex flex-col items-center mobile-grid-item" data-mobile-pos="5,3">
                <img 
                  src={shirt2Image} 
                  alt="Team 2 Player 4"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain opacity-90"
                />
                <span className="text-white text-lg font-medium mt-1">
                  {team2Players[4]}
                </span>
              </div>
            )}

            {/* GK - row 6, col 2 */}
            {team2Players?.[0] && (
              <div className="col-start-6 row-start-2 flex flex-col items-center mobile-grid-item" data-mobile-pos="6,2">
                <img 
                  src={glovesImage} 
                  alt="Team 2 Goalkeeper"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain opacity-90"
                />
                <span className="text-white text-lg font-medium mt-1">
                  {team2Players[0]}
                </span>
              </div>
            )}

            {/* Sixth Player - keep original desktop position */}
            {team2Players?.[5] && (
              <div className="col-start-5 row-start-2 flex flex-col items-center mobile-grid-item" data-mobile-pos="6,2">
                <img 
                  src={shirt2Image} 
                  alt="Team 2 Player 6"
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain opacity-90"
                />
                <span className="text-white text-lg font-medium mt-1">
                  {team2Players[5]}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewFormationModal;