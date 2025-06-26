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
    <div className="flex justify-center w-full px-4">
      <div className="bg-[#2e2c33] rounded-[19px] shadow-md overflow-hidden w-full max-w-md h-[233px] relative">
        <div className="flex flex-col w-[189px] absolute top-[35px] left-[19px] text-white">
          <p className="opacity-45 text-sm">Balance (in-app)</p>
          <h1 className="text-[2.7rem] font-black leading-none">
            {balance.toFixed(2)}
          </h1>
        </div>

        <div className="absolute top-[154px] left-0 w-full flex justify-start px-6">
          <button
            onClick={() => alert('Withdraw clicked!')}
            className="px-12 py-2.5 rounded-xl border border-white bg-[#5555554c] text-white text-sm font-medium backdrop-blur-md backdrop-brightness-100"
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
};

export default InAppBalance;

