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

  if (!telegramId) return null;
  if (balance === null) return <p className="text-white px-4">Loading balance...</p>;

  return (
    <div className="text-white text-xl font-semibold px-4 mt-2">
      🪙 Balance: {balance.toFixed(2)} CHOP
    </div>
  );
};

export default InAppBalance;
