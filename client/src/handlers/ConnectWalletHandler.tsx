import { useTonConnectUI } from '@tonconnect/ui-react';
import ButtonCreateWallet from '../components/buttons/ButtonCreateWallet';
import { useEffect, useState } from 'react';

const ConnectWalletHandler = () => {
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    setOptions({ language: 'en' }); // optional customization
  }, []);

  useEffect(() => {
    if (tonConnectUI.account) {
      setAddress(tonConnectUI.account.address);
    }
  }, [tonConnectUI.account]);

  const handleConnect = () => {
    tonConnectUI.connectWallet();
  };

  return (
    <div>
      {address ? (
        <p className="text-white text-sm">Wallet: {address}</p>
      ) : (
        <ButtonCreateWallet onClick={handleConnect} />
      )}
    </div>
  );
};

export default ConnectWalletHandler;
