import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@twa-dev/sdk';
import Home from './pages/Home';
import TasksPage from './pages/TasksPage';
import Collection from './pages/Collection';
import WalletPage from './pages/WalletPage';
import AdminPage from './pages/AdminPage';



export default function App() {
  return (
    <TonConnectUIProvider manifestUrl="https://kirsumajas.github.io/dapp-ton/tonconnect-manifest.json">
      <Router basename="/dapp-ton">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Router>
    </TonConnectUIProvider>
  );
}
