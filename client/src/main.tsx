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

console.log('[Telegram] WebApp loaded:', WebApp);
console.log('[Telegram] initData:', WebApp.initData);
console.log('[Telegram] initDataUnsafe:', WebApp.initDataUnsafe);

window.onerror = function (message, source, lineno, colno, error) {
  console.error('[Global Error]', { message, source, lineno, colno, error });
};

const initDataValid = !!WebApp.initDataUnsafe?.user;
if (!initDataValid) {
  const root = document.getElementById('root')!;
  root.innerHTML = `<div style="color: white; padding: 2rem;">
    ❌ Error: Telegram init data is missing.<br />
    Please open this Mini App from Telegram.
  </div>`;
  throw new Error('Telegram init data missing');
}

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
