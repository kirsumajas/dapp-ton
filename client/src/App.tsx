// src/App.tsx
import { useEffect, useState } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { BrowserRouter as Router } from 'react-router-dom';
import AnimatedRoutes from './AnimatedRoutes';
import SplashScreen from './components/SplashScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      // Wait 2 seconds after ready, then hide splash
      const timeout = setTimeout(() => setShowSplash(false), 2000);
      return () => clearTimeout(timeout);
    } else {
      // Fallback if Telegram is not available
      const fallbackTimeout = setTimeout(() => setShowSplash(false), 2500);
      return () => clearTimeout(fallbackTimeout);
    }
  }, []);

  return (
    <TonConnectUIProvider manifestUrl="https://kirsumajas.github.io/dapp-ton/tonconnect-manifest.json">
      {showSplash ? (
        <SplashScreen />
      ) : (
        <Router basename="/dapp-ton">
          <AnimatedRoutes />
        </Router>
      )}
    </TonConnectUIProvider>
  );
}
