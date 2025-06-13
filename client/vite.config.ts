// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/dapp-ton/',  // <-- ADD THIS
  plugins: [react()],
});