import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import WebApp from '@twa-dev/sdk';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

// Telegram WebApp readiness
WebApp.ready();
WebApp.expand();
WebApp.requestFullscreen();
import { Buffer } from 'buffer';
(window as any).Buffer = Buffer;

function debugLog(msg: string) {
  const div = document.createElement('div');
  div.style.color = 'white';
  div.style.fontSize = '12px';
  div.style.background = 'rgba(0,0,0,0.6)';
  div.style.padding = '4px';
  div.style.zIndex = '9999';
  div.textContent = `[Debug] ${msg}`;
  document.body.appendChild(div);
}

window.addEventListener('error', (e) => {
  debugLog('💥 JS Error: ' + e.message);
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
