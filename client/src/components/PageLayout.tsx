import { ReactNode } from 'react';
import Navbar from './Navbar';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <div className="flex flex-col h-[var(--app-height)] bg-[#26242A] text-white overflow-hidden">
      {/* Scrollable content */}
      <main
        className={`flex-1 overflow-y-auto pb-[calc(64px+env(safe-area-inset-bottom))] ${className}`}
      >
        {children}
      </main>

      {/* Fixed bottom nav */}
      <div className="fixed bottom-0 left-0 w-full z-50">
        <Navbar />
      </div>
    </div>
  );
}

