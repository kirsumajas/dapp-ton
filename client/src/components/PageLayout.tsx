import { ReactNode, useEffect } from 'react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useWalletStore } from '../store/walletStore';
import Navbar from './Navbar';
import PageWrapper from './layout/PageWrapper'; // ✅ Import wrapper

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

  return (
    <div className="flex flex-col h-[var(--app-height)] bg-[#26242A] text-white overflow-hidden">
      {/* Scrollable content with animation */}
      <main className={`flex-1 overflow-y-auto pb-[calc(64px+env(safe-area-inset-bottom))] ${className}`}>
        <PageWrapper>
          {children}
        </PageWrapper>
      </main>

      {/* Fixed bottom nav stays unanimated */}
      <div className="fixed bottom-0 left-0 w-full z-50">
        <Navbar />
      </div>
    </div>
  );
}
