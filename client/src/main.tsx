import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import WebApp from '@twa-dev/sdk';

// Tell Telegram the app is ready
WebApp.ready();
WebApp.expand();
WebApp.requestFullscreen();

// Set --app-height using stable viewport height
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

// Render the app
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

