import { TonConnectUIProvider } from '@tonconnect/ui-react';
import ConnectWalletButton from './components/ConnectWalletButton';
import AirdropButton from './components/AirdropButton';
import Tasks from './components/Tasks';
import JettonStats from './components/JettonStats';
import Footer from './components/Footer';

export default function App() {
  return (
    <TonConnectUIProvider manifestUrl="https://kirsumajas.github.io/dapp-ton/tonconnect-manifest.json">
      <div className="min-h-screen bg-black text-white font-sans">
        <header className="flex justify-between items-center p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold tracking-tight">Chekhovsky Choppa</h1>
          <ConnectWalletButton />
        </header>

        <main className="p-6 max-w-4xl mx-auto space-y-12">
          <section>
            <h2 className="text-xl font-semibold mb-3">🔥 Claim Airdrop</h2>
            <AirdropButton />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">🧩 Tasks</h2>
            <Tasks />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">📊 Jetton Statistics</h2>
            <JettonStats />
          </section>
        </main>

        <Footer />
      </div>
    </TonConnectUIProvider>
  );
}
