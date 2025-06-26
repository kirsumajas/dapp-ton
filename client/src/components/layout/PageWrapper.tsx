// src/components/layout/PageWrapper.tsx
import { motion } from 'framer-motion';
import React from 'react';

const variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.1, ease: 'easeOut' }}
    variants={variants}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

export default PageWrapper;
