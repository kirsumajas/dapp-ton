import { ReactNode } from 'react';
import Navbar from './Navbar';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <div className="flex flex-col h-[var(--app-height)] bg-[#26242A] text-white overflow-hidden">
      {/* Main scrollable content with bottom padding for navbar safe area */}
      <main className={`flex-1 overflow-y-auto pb-[calc(64px+env(safe-area-inset-bottom))] ${className}`}>
        {children}
      </main>

      {/* Bottom navbar absolutely positioned, respecting safe area inset */}
      <div className="fixed bottom-0 left-0 w-full z-500">
        <Navbar />
      </div>
    </div>
  );
}


