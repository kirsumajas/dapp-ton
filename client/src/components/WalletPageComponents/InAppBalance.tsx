import React, { useEffect } from 'react';
import { getTelegramUserId } from '../../utils/getTelegramUser';
import { useBalanceStore } from '../../store/balanceStore';

const InAppBalance: React.FC = () => {
  const telegramId = getTelegramUserId();
  const { balance, fetchBalance } = useBalanceStore();

  useEffect(() => {
    if (telegramId) {
      fetchBalance(telegramId);
    }
  }, [telegramId, fetchBalance]);

  if (!telegramId || balance === null) return null;

  return (
    <div className="flex flex-col items-center w-full px-4 py-8">
      {/* Balance Display - Revolut Style */}
      <div className="text-center mb-8">
        <p className="text-gray-400 text-sm mb-2">Your balance</p>
        <h1 className="text-white text-6xl font-light tracking-tight">
          {balance.toFixed(2)}
        </h1>
        <p className="text-gray-500 text-sm mt-1">USD</p>
      </div>

      {/* Action Widgets */}
      <div className="flex flex-wrap justify-center gap-4 w-full max-w-md">
        {/* Withdraw Widget */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => alert('Withdraw clicked!')}
            className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-2 hover:bg-white/20 transition-colors"
          >
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
              />
            </svg>
          </button>
          <span className="text-white text-xs">Withdraw</span>
        </div>

        {/* Top Up Widget */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => alert('Top up clicked!')}
            className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-2 hover:bg-white/20 transition-colors"
          >
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
              />
            </svg>
          </button>
          <span className="text-white text-xs">Top up</span>
        </div>

        {/* Exchange Widget */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => alert('Exchange clicked!')}
            className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-2 hover:bg-white/20 transition-colors"
          >
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" 
              />
            </svg>
          </button>
          <span className="text-white text-xs">Exchange</span>
        </div>

        {/* More Widget */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => alert('More options clicked!')}
            className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-2 hover:bg-white/20 transition-colors"
          >
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" 
              />
            </svg>
          </button>
          <span className="text-white text-xs">More</span>
        </div>
      </div>
    </div>
  );
};

export default InAppBalance;