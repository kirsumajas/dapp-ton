import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SlideUpPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const SlideUpPopup: React.FC<SlideUpPopupProps> = ({ isOpen, onClose, title, children }) => {
  const [isScrollLocked, setIsScrollLocked] = useState(true);

  // Prevent page scrolling when popup is open
  useEffect(() => {
    if (isOpen) {
      // Disable scrolling on the body/page
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      
      // Also try to prevent scrolling on the main app container
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.style.overflow = 'hidden';
      }
    } else {
      // Re-enable scrolling
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.style.overflow = '';
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.style.overflow = '';
      }
    };
  }, [isOpen]);

  const handleScrollLockChange = (shouldLock: boolean) => {
    setIsScrollLocked(shouldLock);
  };

  // Clone children and pass the scroll lock handler if it's the GrowingGraph component
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type && 
        (child.type as any).name === 'GrowingGraph') {
      return React.cloneElement(child as React.ReactElement<any>, {
        onScrollLockChange: handleScrollLockChange
      });
    }
    return child;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Slide-up container */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-[#1f1f23] rounded-t-2xl z-50 text-white flex flex-col"
            style={{
              // Use a more flexible height approach - take up 80% of screen height
              maxHeight: '80vh',
              minHeight: '60vh', // Ensure it's at least 60% of screen height
              paddingTop: '1rem',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              paddingBottom: 'max(env(safe-area-inset-bottom, 16px), 16px)',
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.5 }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            onTouchMove={(e) => {
              // Only prevent if we're in locked scroll mode
              if (isScrollLocked) {
                e.stopPropagation();
              }
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
            }}
            onWheel={(e) => {
              // Prevent wheel events from bubbling up when scroll is locked
              if (isScrollLocked) {
                e.stopPropagation();
              }
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <h2 className="text-lg font-bold">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Scrollable content - conditionally lock scrolling */}
            <div 
              className={`flex-1 pr-1 ${isScrollLocked ? 'overflow-hidden' : 'overflow-y-auto'}`}
              style={{
                // Prevent momentum scrolling on iOS when locked
                WebkitOverflowScrolling: isScrollLocked ? 'auto' : 'touch'
              }}
              onTouchMove={(e) => {
                // Prevent popup content from affecting page scroll when locked
                if (isScrollLocked) {
                  e.stopPropagation();
                }
              }}
            >
              {enhancedChildren}
              
              {/* Additional content that appears after cards are done */}
              {!isScrollLocked && (
                <div className="mt-8 space-y-6 pb-8">
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-xl font-bold mb-4">What's Next?</h3>
                    <p className="text-gray-300 mb-4">
                      Our roadmap doesn't end here. We're continuously working on new features 
                      and partnerships to make ChopCoin the premier choice for crypto enthusiasts.
                    </p>
                    <div className="space-y-3">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Community Growth</h4>
                        <p className="text-sm text-gray-400">
                          Expanding our community through targeted marketing and partnerships.
                        </p>
                      </div>
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Product Development</h4>
                        <p className="text-sm text-gray-400">
                          Launching new features and improving user experience.
                        </p>
                      </div>
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Strategic Partnerships</h4>
                        <p className="text-sm text-gray-400">
                          Collaborating with leading platforms and services in the crypto space.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SlideUpPopup;