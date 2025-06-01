import { useState, useEffect, useRef } from 'react';
import stadiumsData from '../../data/stadiums.json';
import { XMarkIcon } from '@heroicons/react/24/outline';
import '../../styles/modal.css';

function MatchModal({ isOpen, onClose, onSubmit, initialData }) {
  const [selectedStadium, setSelectedStadium] = useState('');
  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);
  const [matchTime, setMatchTime] = useState('');
  const [matchDay, setMatchDay] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const formRef = useRef(null);
  const modalRef = useRef(null);
  const timeInputRef = useRef(null);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  // Initialize form when modal opens or when editing
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);

      if (initialData) {
        // If editing existing match
        setSelectedStadium(initialData.stadium.id.toString());
        setTeam1Players([...initialData.team1Players]);
        setTeam2Players([...initialData.team2Players]);
        setMatchTime(initialData.matchTime);
        setMatchDay(initialData.matchDay);
      } else {
        // For new match
        setSelectedStadium('');
        setTeam1Players([]);
        setTeam2Players([]);
        setMatchTime('');
        setMatchDay('');
      }
      
      // Add keyboard event listener for ESC key
      const handleEscKey = (e) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };
      
      document.addEventListener('keydown', handleEscKey);
      
      // Cleanup function
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [isOpen, initialData]);

  // Update players arrays when stadium changes
  useEffect(() => {
    if (selectedStadium) {
      const stadium = stadiumsData.stadiums.find(s => s.id === parseInt(selectedStadium));
      const playersPerTeam = stadium ? stadium.maxPlayers / 2 : 0;
      
      // Only reset players if not editing or if team size changed
      if (!initialData || (team1Players.length !== playersPerTeam)) {
        setTeam1Players(Array(playersPerTeam).fill(''));
        setTeam2Players(Array(playersPerTeam).fill(''));
      }
      
      // Focus time input for better mobile UX
      if (timeInputRef.current && window.innerWidth <= 640) {
        // Use a timeout to ensure the DOM has updated
        setTimeout(() => {
          timeInputRef.current.focus();
        }, 100);
      }
    }
  }, [selectedStadium, initialData, team1Players.length]);

  // Handle scroll events to show/hide scroll-to-top button
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const handleScroll = () => {
        if (modalRef.current.scrollTop > 300) {
          setShowScrollTop(true);
        } else {
          setShowScrollTop(false);
        }
      };
      
      modalRef.current.addEventListener('scroll', handleScroll);
      
      return () => {
        if (modalRef.current) {
          modalRef.current.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, [isOpen]);

  // Focus handling for accessibility
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Set focus to the modal when it opens
      modalRef.current.focus();
      
      // Trap focus within the modal
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        const handleTabKey = (e) => {
          if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        };
        
        modalRef.current.addEventListener('keydown', handleTabKey);
        
        return () => {
          modalRef.current?.removeEventListener('keydown', handleTabKey);
        };
      }
    }
  }, [isOpen, selectedStadium]);

  // Apply Safari-specific optimizations
  useEffect(() => {
    // Check if running on Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isSafari && isOpen && modalRef.current) {
      // Force hardware acceleration and prevent flickering in Safari
      modalRef.current.classList.add('transform-fix');
      
      // Safari-specific animation optimizations
      const allAnimatedElements = modalRef.current.querySelectorAll('.animate-pulse, .animate-fadeIn, .animate-fadeOut, .transition-all');
      allAnimatedElements.forEach(el => {
        el.style.webkitTransform = 'translateZ(0)';
        el.style.webkitBackfaceVisibility = 'hidden';
      });
      
      // Improve Safari form input rendering
      const formInputs = modalRef.current.querySelectorAll('input, select, button');
      formInputs.forEach(input => {
        input.style.webkitAppearance = 'none';
        input.style.webkitTapHighlightColor = 'transparent';
      });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const stadium = stadiumsData.stadiums.find(s => s.id === parseInt(selectedStadium));
    
    const formData = {
      stadium,
      team1Players,
      team2Players,
      matchTime,
      matchDay,
      timestamp: initialData ? initialData.timestamp : new Date().toISOString(),
      id: initialData ? initialData.id : Date.now()
    };
    
    onSubmit(formData);
    handleClose();
  };

  const handlePlayerChange = (team, index, value) => {
    if (team === 1) {
      const newPlayers = [...team1Players];
      newPlayers[index] = value;
      setTeam1Players(newPlayers);
    } else {
      const newPlayers = [...team2Players];
      newPlayers[index] = value;
      setTeam2Players(newPlayers);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Swipe handling for mobile
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    
    // Add visual feedback for touch start
    if (modalRef.current && window.innerWidth < 640) {
      modalRef.current.classList.add('touch-active');
      
      // Safari-specific optimizations
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (isSafari) {
        // Force hardware acceleration for Safari
        modalRef.current.style.webkitTransform = 'translateZ(0)';
        modalRef.current.style.webkitBackfaceVisibility = 'hidden';
      }
    }
  };
  
  const handleTouchMove = (e) => {
    touchEndY.current = e.touches[0].clientY;
    
    // Add visual drag feedback
    if (modalRef.current && window.innerWidth < 640) {
      const distance = touchEndY.current - touchStartY.current;
      if (distance > 0) {
        // Only apply transform when dragging down
        const translateValue = Math.min(distance * 0.4, 150);
        modalRef.current.style.transform = `translateY(${translateValue}px)`;
        modalRef.current.style.webkitTransform = `translateY(${translateValue}px)`;
        modalRef.current.style.opacity = `${1 - Math.min(distance * 0.002, 0.3)}`;
      }
    }
  };
  
  const handleTouchEnd = () => {
    // If swiped down more than 100px on mobile devices, close the modal
    if (touchEndY.current - touchStartY.current > 100 && window.innerWidth < 640) {
      handleClose();
    } else if (modalRef.current) {
      // Reset the transform if not closing
      modalRef.current.style.transform = '';
      modalRef.current.style.webkitTransform = '';
      modalRef.current.style.opacity = '';
      modalRef.current.classList.remove('touch-active');
    }
    
    // Reset values
    touchStartY.current = 0;
    touchEndY.current = 0;
  };

  const scrollToTop = () => {
    if (modalRef.current) {
      modalRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Add visual feedback for form validation
  const handleInvalidInput = (e) => {
    // Add mobile-friendly validation feedback
    if (window.innerWidth < 640) {
      // Check if running on Safari
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      
      // Add the invalid class for animation
      e.target.classList.add('invalid-input');
      
      // Safari-specific optimizations for animation
      if (isSafari) {
        e.target.style.webkitTransform = 'translateZ(0)';
        e.target.style.webkitBackfaceVisibility = 'hidden';
      }
      
      // Remove the class after animation completes
      setTimeout(() => {
        e.target.classList.remove('invalid-input');
        if (isSafari) {
          e.target.style.webkitTransform = '';
        }
      }, 820); // Animation duration + a bit extra
      
      // Add haptic feedback if available
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(80);
      }
    }
  };
  
  // Handle taps on input fields for mobile
  const handleInputTap = (e) => {
    if (window.innerWidth < 640) {
      // Provide visual feedback
      e.target.classList.add('touch-active');
      
      // Add haptic feedback for touch devices if available
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(10); // Very light tap feedback
      }
      
      // Remove the active class after a short delay
      setTimeout(() => {
        e.target.classList.remove('touch-active');
      }, 150);
      
      // For time inputs on iOS, ensure they're properly focusable
      if (e.target.type === 'time' && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
        e.target.focus();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className={`absolute inset-0 bg-black/50 modal-overlay ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
        onClick={handleClose}
      />
      <div 
        className={`relative bg-gray-100 rounded-lg p-4 sm:p-6 w-full max-w-[95%] sm:max-w-2xl mx-auto max-h-[90vh] overflow-y-auto modal-content ${
          isClosing ? 'animate-slideOut' : 'animate-slideIn'
        }`}
        onClick={e => e.stopPropagation()}
        ref={modalRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
        aria-labelledby="modal-title"
      >
        {/* Mobile swipe indicator - only visible on small screens */}
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3 sm:hidden"></div>
        
        <div className="flex justify-between items-center mb-4 sm:mb-6 sticky top-0 bg-gray-100 pt-1 pb-2 z-10">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900" id="modal-title">
            {initialData ? 'მატჩის რედაქტირება' : 'ახალი მატჩის შექმნა'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        <form 
          onSubmit={handleSubmit} 
          ref={formRef} 
          className="space-y-4 sm:space-y-6"
          onInvalid={handleInvalidInput}
          noValidate={false}
          autoComplete="on"
        >
          {/* Match Details Section */}
          <div className="bg-green-50 rounded-lg p-4 sm:p-6 shadow-sm">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">მატჩის დეტალები</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Stadium Selection */}
              <div className="col-span-2">
                <label className="block">
                  <span className="text-gray-700 text-sm sm:text-base font-medium mb-1 sm:mb-2 flex items-center gap-2">
                    აირჩიეთ სტადიონი <span className="text-xl sm:text-2xl">🏟️</span>
                  </span>
                  <select
                    value={selectedStadium}
                    onChange={(e) => setSelectedStadium(e.target.value)}
                    required
                    className="mt-1 sm:mt-2 block w-full h-10 sm:h-11 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base mobile-select"
                    style={{
                      minHeight: '44px',
                      WebkitAppearance: 'none',
                      appearance: 'none'
                    }}
                  >
                    <option value="">აირჩიეთ სტადიონი</option>
                    {stadiumsData.stadiums.map(stadium => (
                      <option key={stadium.id} value={stadium.id}>
                        {stadium.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {selectedStadium && (
                <>

                 {/* Match Day */}
                  <div className="space-y-3 sm:space-y-4">
                    <label className="block ">
                      <span className="text-gray-700  text-sm sm:text-base font-medium mb-1 sm:mb-2 flex items-center gap-2">
                        მატჩის დღე <span className="text-xl sm:text-2xl">📅</span>
                      </span>
                      <div className="mt-1 sm:mt-2 relative">
                        <select
                          value={matchDay}
                          onChange={(e) => setMatchDay(e.target.value)}
                          required
                          className="block text-center w-full h-10 sm:h-11 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 text-sm sm:text-base mobile-select"
                          style={{
                            minHeight: '44px',
                            WebkitAppearance: 'none',
                            appearance: 'none'
                          }}
                          onClick={handleInputTap}
                          onTouchStart={handleInputTap}
                        >
                          <option value="">აირჩიეთ დღე</option>
                          <option value="ორშაბათი">ორშაბათი</option>
                          <option value="სამშაბათი">სამშაბათი</option>
                          <option value="ოთხშაბათი">ოთხშაბათი</option>
                          <option value="ხუთშაბათი">ხუთშაბათი</option>
                          <option value="პარასკევი">პარასკევი</option>
                          <option value="შაბათი">შაბათი</option>
                          <option value="კვირა">კვირა</option>
                        </select>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 sm:h-5 sm:w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </label>
                  </div>
                  {/* Match Time */}
                  <div className="space-y-3 sm:space-y-4">
                    <label className="block">
                      <span className="text-gray-700 text-sm sm:text-base font-medium mb-1 sm:mb-2 flex items-center gap-2">
                        მატჩის დრო <span className="text-xl sm:text-2xl">⏰</span>
                      </span>
                      <div className="mt-1 sm:mt-2 relative">
                        <input
                          type="time"
                          value={matchTime}
                          onChange={(e) => setMatchTime(e.target.value)}
                          required
                          className="block w-full text-center h-10 sm:h-11 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10 text-sm sm:text-base mobile-input"
                          style={{
                            // Force larger height for better touch targets
                            minHeight: '44px',
                            // Fix alignment issues on iOS
                            WebkitAppearance: 'none',
                            appearance: 'none'
                          }}
                          ref={timeInputRef}
                          onClick={handleInputTap}
                          onTouchStart={handleInputTap}
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 sm:h-5 sm:w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </label>
                  </div>

                 
                </>
              )}
            </div>
          </div>

          {selectedStadium && (
            /* Teams Section */
            <div className="bg-green-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                {/* Team 1 */}
                <div className="team1 bg-green-50 rounded-lg p-3 sm:p-4">
                  <h4 className="text-base sm:text-lg font-semibold text-blue-900 mb-3 sm:mb-4 flex items-center justify-center">
                    გუნდი 1
                  </h4>
                  <div className="space-y-2 sm:space-y-3">
                    {team1Players.map((player, index) => (
                      <div key={index} className="flex items-center space-x-2 sm:space-x-4">
                        <div className="w-14 sm:w-24 h-8 sm:h-10 flex items-center justify-center rounded-md">
                          <span className="text-blue-700 text-xl sm:text-2xl font-medium">{index === 0 ? '🧤' : `🏃‍♂️`}</span>
                        </div>
                        <input
                          type="text"
                          value={player}
                          onChange={(e) => handlePlayerChange(1, index, e.target.value)}
                          required
                          className="flex-1 h-9 sm:h-10 p-2 text-sm sm:text-base rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mobile-input"
                          placeholder={index === 0 ? ' მეკარე' : ' მოთამაშე'}
                          style={{
                            minHeight: '40px',
                            WebkitAppearance: 'none',
                            appearance: 'none'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team 2 */}
                <div className="team2 bg-green-50 rounded-lg p-3 sm:p-4">
                  <h4 className="text-base sm:text-lg font-semibold text-green-900 mb-3 sm:mb-4 flex items-center justify-center">
                    გუნდი 2
                  </h4>
                  <div className="space-y-2 sm:space-y-3">
                    {team2Players.map((player, index) => (
                      <div key={index} className="flex items-center space-x-2 sm:space-x-4">
                        <div className="w-14 sm:w-24 h-8 sm:h-10 flex items-center justify-center rounded-md">
                          <span className="text-red-700 text-xl sm:text-2xl font-medium">{index === 0 ? '🧤' : `🏃‍♂️`}</span>
                        </div>
                        <input
                          type="text"
                          value={player}
                          onChange={(e) => handlePlayerChange(2, index, e.target.value)}
                          required
                          className="flex-1 h-9 sm:h-10 p-2 text-sm sm:text-base rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mobile-input"
                          placeholder={index === 0 ? ' მეკარე' : ' მოთამაშე'}
                          style={{
                            minHeight: '40px',
                            WebkitAppearance: 'none',
                            appearance: 'none'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="mt-6 sm:mt-8 pt-3 sm:pt-5 border-t border-gray-200">
            <div className="flex justify-between sm:justify-end space-x-2 sm:space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:bg-gray-200 active:scale-95 transition-all duration-150"
              >
                <svg className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                გაუქმება
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 active:bg-green-800 active:scale-95 transition-all duration-150"
              >
                <svg className="mr-1 sm:mr-2 h-3 sm:h-4 w-3 sm:w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {initialData ? 'განახლება' : 'შექმნა'}
              </button>
            </div>
          </div>
        </form>
        
        {/* Scroll to top button - only visible when scrolled down on mobile */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-20 right-4 p-2 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 active:bg-green-800 active:scale-95 transition-all duration-150 z-30 sm:hidden"
            aria-label="Scroll to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default MatchModal;
