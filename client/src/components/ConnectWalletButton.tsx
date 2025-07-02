import { useTonConnectUI } from '@tonconnect/ui-react';
import ButtonCreateWallet from './buttons/ButtonCreateWallet';
import { useEffect } from 'react';
import { useWalletStore } from '../store/walletStore';
import { connectWalletAPI } from '../api/wallet';
import { getTelegramUserId } from '../utils/getTelegramUser';

export default function ConnectWalletButton() {
  const [tonConnectUI] = useTonConnectUI();
  const { address, setAddress } = useWalletStore();

  useEffect(() => {
    setAddress(tonConnectUI.account?.address ?? null);

    const unsubscribe = tonConnectUI.onStatusChange(async (wallet) => {
      const walletAddress = wallet?.account?.address ?? null;
      setAddress(walletAddress);

      if (walletAddress) {
        localStorage.setItem('walletAddress', walletAddress);

        // Send wallet to backend
        const telegramId = getTelegramUserId();

        if (telegramId) {
          try {
            const result = await connectWalletAPI(telegramId, walletAddress);
            console.log('Wallet connected on backend:', result);
          } catch (error) {
            console.error('Error sending wallet to backend:', error);
          }
        } else {
          console.error('Telegram user ID not found, cannot save wallet to backend.');
        }
      } else {
        localStorage.removeItem('walletAddress');
      }
    });

    return () => unsubscribe();
  }, [tonConnectUI, setAddress]);

  const handleConnect = () => {
    tonConnectUI.connectWallet();
  };

  const handleDisconnect = () => {
    tonConnectUI.disconnect();
    setAddress(null);
    localStorage.removeItem('walletAddress');
  };

  if (address) {
    return (
      <div className="flex flex-col items-end space-y-1">
        <p className="text-white text-sm truncate max-w-[180px] text-right">
          {`${address.slice(0, 5)}...${address.slice(-3)}`}
        </p>
        <button
          onClick={handleDisconnect}
          className="text-xs text-red-400 hover:underline"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <ButtonCreateWallet onClick={handleConnect} className="w-[127px] h-[46px]" />
  );
}
