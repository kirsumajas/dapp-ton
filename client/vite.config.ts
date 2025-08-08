import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  base: '/dapp-ton/', // ✅ MUST match your GitHub repo name
  plugins: [
    react(),
    nodePolyfills({
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      buffer: 'buffer', // Only polyfill what you actually use
    },
  },
  define: {
    'process.env': {}, // Prevents crashing when process.env is used
  },
});
