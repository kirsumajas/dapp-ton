/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getTelegramUserId } from '../utils/getTelegramUser';

const InAppBalance: React.FC = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const telegramId = getTelegramUserId();

  useEffect(() => {
    if (!telegramId) return;

    const fetchBalance = async () => {
      try {
        const res = await axios.get(`/api/balance/${telegramId}`);
        setBalance(res.data.balance);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [telegramId]);

  if (!telegramId) return null;
  if (loading) return <p className="text-white px-4">Loading balance...</p>;

  return (
    <div className="text-white text-xl font-semibold px-4 mt-2">
      🪙 Balance: {balance ?? 0} CHOP
    </div>
  );
};

export default InAppBalance; */
