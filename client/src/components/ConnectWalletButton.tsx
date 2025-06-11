import { useTonConnectUI } from '@tonconnect/ui-react';
import ButtonCreateWallet from './buttons/ButtonCreateWallet';
import { useEffect } from 'react';
import { useWalletStore } from '../store/walletStore';

export default function ConnectWalletButton() {
  const [tonConnectUI] = useTonConnectUI();
  const { address, setAddress } = useWalletStore();

  useEffect(() => {
    setAddress(tonConnectUI.account?.address ?? null);
  }, [tonConnectUI.account, setAddress]);

  const handleConnect = () => {
    tonConnectUI.connectWallet();
  };

  const handleDisconnect = () => {
    tonConnectUI.disconnect();
    setAddress(null); // Clear local state
  };

  if (address) {
    return (
      <div className="flex flex-col items-end space-y-1">
        <p className="text-white text-sm truncate max-w-[180px] text-right">
          {address}
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

  return <ButtonCreateWallet onClick={handleConnect} className="w-[127px] h-[46px]" />;
}
