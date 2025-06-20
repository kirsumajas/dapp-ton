// src/components/AlertModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title = 'Notice',
  message,
  confirmText = 'OK',
  onConfirm,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed inset-x-4 top-1/3 bg-[#1f1f23] rounded-2xl z-50 p-6 text-white shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <div className="flex flex-col items-center">
              <h2 className="text-lg font-bold mb-2">{title}</h2>
              <p className="text-sm text-center text-gray-300 mb-4">{message}</p>
              <button
                onClick={() => {
                  onConfirm?.();
                  onClose();
                }}
                className="bg-[#2e2c33] text-white text-sm font-semibold px-6 py-2 rounded-xl hover:opacity-80"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AlertModal;
