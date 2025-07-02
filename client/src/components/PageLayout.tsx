import { ReactNode, useEffect, useMemo } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useWalletStore } from '../store/walletStore';
import Navbar from './Navbar';
import PageWrapper from './layout/PageWrapper';
import { getPlatform } from '../utils/getPlatform';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function PageLayout({ children, className = '' }: PageLayoutProps) {
  const [tonConnectUI] = useTonConnectUI();
  const { setAddress } = useWalletStore();

  useEffect(() => {
    const walletAddress = tonConnectUI.account?.address ?? null;
    setAddress(walletAddress);
  }, [tonConnectUI.account?.address, setAddress]);

  const platform = getPlatform();

  const safeStyles = useMemo(() => {
    switch (platform) {
      case 'ios':
        return {
          paddingTop: 'env(tg-content-safe-area-inset-top, 20px)',
          paddingBottom: 'calc(env(tg-content-safe-area-inset-bottom, 0px) + 16px)',
        };
      case 'android':
        return {
          paddingTop: '68px',
          paddingBottom: '16px',
        };
      default:
        return {
          paddingTop: '5px',
          paddingBottom: '16px',
        };
    }
  }, [platform]);

  return (
    <div
      className="flex flex-col h-[var(--app-height)] bg-[#26242A] text-white overflow-hidden"
      style={safeStyles}
    >
      <main className={`flex-1 overflow-y-auto ${className}`}>
        <PageWrapper>{children}</PageWrapper>
      </main>

      <div className="fixed bottom-0 left-0 w-full z-50">
        <Navbar />
      </div>
    </div>
  );
}
