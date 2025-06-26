// src/components/SplashScreen.tsx
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/Logo.svg';

const SplashScreen = () => {
  return (
    <AnimatePresence>
      <motion.div
        key="splash"
        className="fixed inset-0 flex items-center justify-center bg-[#26242A] z-50"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.img
          src={logo}
          alt="Logo"
          className="w-32 h-32"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
