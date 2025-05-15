import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import '@twa-dev/sdk';
import Home from './pages/Home';
import TasksPage from './pages/TasksPage';
import Collection from './pages/Collection';

export default function App() {
  return (
    <TonConnectUIProvider manifestUrl="https://kirsumajas.github.io/dapp-ton/tonconnect-manifest.json">
      <Router basename="/dapp-ton">
        <div className="min-h-screen bg-black text-white font-sans pb-20 px-6 max-w-3xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/collection" element={<Collection />} />
          </Routes>
          <Navbar />
        </div>
      </Router>
    </TonConnectUIProvider>
  );
}

