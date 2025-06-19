// src/components/SlideUpPopup.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SlideUpPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const SlideUpPopup: React.FC<SlideUpPopupProps> = ({ isOpen, onClose, title, children }) => {
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

          {/* Slide-up panel */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-[#1f1f23] rounded-t-2xl z-50 p-6 text-white mb-40"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{title}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">
                ✕
              </button>
            </div>
            <div>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SlideUpPopup;
