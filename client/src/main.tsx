import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import WebApp from '@twa-dev/sdk';

WebApp.ready();

console.log("Main.tsx loaded successfully");

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
