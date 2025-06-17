import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import WebApp from '@twa-dev/sdk';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { Buffer } from 'buffer';


// Telegram WebApp readiness
WebApp.ready();
WebApp.expand();
WebApp.requestFullscreen();

(window as any).Buffer = Buffer;

import { logToBackend } from './utils/logToBackend';

window.addEventListener('error', (e) => {
  logToBackend('error', 'JS Error', { message: e.message, filename: e.filename });
});

window.addEventListener('unhandledrejection', (e) => {
  logToBackend('error', 'Unhandled promise rejection', { reason: e.reason });
});

// Set --app-height for viewport-safe UI
const setAppHeight = () => {
  const stableHeight = WebApp.viewportStableHeight || window.innerHeight;
  document.documentElement.style.setProperty('--app-height', `${stableHeight}px`);
  console.log('App height set to:', stableHeight);
};

setAppHeight();
// Listen to Telegram viewport change events
WebApp.onEvent('viewportChanged', (event) => {
  if (event.isStateStable) {
    setAppHeight();
  }
});

// 🚀 Wrap with TonConnectUIProvider
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TonConnectUIProvider
       manifestUrl="https://kirsumajas.github.io/dapp-ton/tonconnect-manifest.json"
    >
      <App />
    </TonConnectUIProvider>
  </StrictMode>
);
