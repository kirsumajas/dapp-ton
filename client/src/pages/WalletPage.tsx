import { useState } from 'react';
import ConnectWalletButton from '../components/ConnectWalletButton';
import PageLayout from '../components/PageLayout';
import logo from '../assets/Logo.svg';
import AlertModal from '../components/AlertModal';
import StatsCard from '../components/WalletPageComponents/JettonCard';
import TransactionHistory from '../components/WalletPageComponents/TransactionHistory';
import InAppBalance from '../components/WalletPageComponents/InAppBalance';
import { getTelegramUserId } from '../utils/getTelegramUser';
import  WithdrawButton  from '../components/WalletPageComponents/WithdrawButton';


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
      <div className="p-4">
        <h2 className="text-white text-lg mb-2">Withdraw your earnings</h2>
        <WithdrawButton amount={0.5} />
      </div>
      
      {/* In-app balance card */}
      <InAppBalance />

      <TransactionHistory telegramId={telegramId} />

      <div className="h-[40px]"></div>

      <StatsCard
        price={0.005}
        liquidity={12000}
        holders={734}
        circulating={870000000}
        onBuyClick={() => window.open('https://getgems.io/...', '_blank')}
      />

      <div className="h-[40px]"></div>

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title="Gas Fee Required"
        message="You need to pay a small gas fee to process the withdrawal transaction."
        confirmText="Proceed"
        onConfirm={handleWithdraw}
      />

      <div className="h-[80px]"></div>
    </PageLayout>
  
  );
}
