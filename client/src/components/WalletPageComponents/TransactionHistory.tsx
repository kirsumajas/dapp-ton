import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface HistoryItem {
  type: 'reward' | 'withdraw';
  amount: number;
  timestamp: string;
  description: string;
}

interface Props {
  telegramId: string;
}

const TransactionHistory: React.FC<Props> = ({ telegramId }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!telegramId) return;

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`/api/wallet/history/${telegramId}`);
        if (res.data.success) {
          setHistory(res.data.history);
        }
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [telegramId]);

  if (loading) return <p className="text-white">Loading history...</p>;

  if (history.length === 0) {
    return <p className="text-white">No transaction history yet.</p>;
  }

  return (
    <div className="mt-6 bg-[#2e2c33] rounded-xl p-4 text-white">
      <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
      <ul className="space-y-3">
        {history.map((item, index) => (
          <li key={index} className="flex justify-between items-center border-b border-gray-600 pb-2">
            <div>
              <p className="font-medium">{item.description}</p>
              <p className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
            </div>
            <p className={`font-bold ${item.type === 'reward' ? 'text-green-400' : 'text-red-400'}`}>
              {item.type === 'reward' ? '+' : '-'}{item.amount} TON
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistory;
