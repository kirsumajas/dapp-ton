import  { useState, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import logo from '../assets/Logo.svg';
import ConnectWalletButton from '../components/ConnectWalletButton';
import { getTelegramUserId } from '../utils/getTelegramUser';
import { useWalletStore } from '../store/walletStore';
import TransactionList from '../components/TransactionList';

export default function Collection() {
  const [telegramId, setTelegramId] = useState<string | null>(null);
  const walletAddress = useWalletStore(state => state.address);

  useEffect(() => {
    const id = getTelegramUserId();
    if (id) setTelegramId(id);
  }, []);

  return (
    <PageLayout>
      <section className="pt-[calc(env(safe-area-inset-top)+92px)] pb-4 px-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="ChopCoin Logo" className="w-[122px] h-[49px] object-contain" />
        </div>
        <ConnectWalletButton />
      </section>

      {/* Optionally display telegram user info */}
      {/* <TelegramUserId /> */}

      {telegramId && walletAddress ? (
        <TransactionList telegramId={telegramId} walletAddress={walletAddress} />
      ) : (
        <p className="text-center mt-6 text-gray-600">Connect your wallet to view transactions.</p>
      )}
    </PageLayout>
  );
}
