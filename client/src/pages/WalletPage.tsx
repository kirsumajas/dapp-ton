import { useState } from 'react';
import ConnectWalletButton from '../components/ConnectWalletButton';
import PageLayout from '../components/PageLayout';
import logo from '../assets/Logo.svg';
import InAppCard from '../components/WalletPageComponents/InAppCard';
import AlertModal from '../components/AlertModal';
import StatsCard from '../components/WalletPageComponents/JettonCard';
import TransactionHistory from '../components/WalletPageComponents/TransactionHistory';
import { getTelegramUserId } from '../utils/getTelegramUser';

export default function Wallet() {
  const [showAlert, setShowAlert] = useState(false);

  const handleWithdraw = () => {
    console.log('Proceeding with withdrawal...');
    setShowAlert(false);
    // Optionally trigger WithdrawForm submission or show withdraw section
  };
  const telegramId = getTelegramUserId(); // or however you retrieve it

  if (!telegramId) {
    return <div className="text-white p-4">⚠️ Telegram ID not found.</div>;
  }
  return (
    <PageLayout>
      {/* Header */}
      <section className="pt-[calc(env(safe-area-inset-top)+92px)] pb-4 px-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="ChopCoin Logo"
            className="w-[122px] h-[49px] object-contain"
          />
        </div>

      {/* Wallet connect button */}
        <ConnectWalletButton />
      </section>
      
      {/* In-app balance card */}
      <InAppCard balance={1000} onWithdraw={() => setShowAlert(true)} />
      <TransactionHistory telegramId={telegramId} />
      {/* Spacer */}
      <div className="h-[40px]"></div>
      <StatsCard
        price={0.005}
        liquidity={12000}
        holders={734}
        circulating={870000000}
        onBuyClick={() => window.open('https://getgems.io/...', '_blank')}
      />

      {/* Spacer */}
      <div className="h-[40px]"></div>

      {/* Slide-up alert modal */}
      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title="Gas Fee Required"
        message="You need to pay a small gas fee to process the withdrawal transaction."
        confirmText="Proceed"
        onConfirm={handleWithdraw}
      />

      {/* Scroll buffer to avoid nav overlap */}
      <div className="h-[80px]"></div>
    </PageLayout>
  );
}
