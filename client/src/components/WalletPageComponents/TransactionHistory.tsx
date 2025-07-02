import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistoryStore, HistoryItem } from '../../store/historyStore';

interface Props {
  telegramId: string;
}

const BASE_API = import.meta.env.VITE_API_URL;

const TransactionHistory: React.FC<Props> = ({ telegramId }) => {
  const [loading, setLoading] = useState(true);
  const history: HistoryItem[] = useHistoryStore((s) => s.history);
  const setHistory = useHistoryStore((s) => s.setHistory);

  useEffect(() => {
    if (!telegramId || history.length > 0) {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${BASE_API}/api/history/${telegramId}`);
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
  }, [telegramId, history.length, setHistory]);

  if (loading) {
    return <p className="text-white">Loading history...</p>;
  }

  if (history.length === 0) {
    return (
      <div className="mt-6 bg-[#2e2c33] rounded-xl p-8 text-center text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto h-12 w-12 mb-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6M12 7a4 4 0 110-8 4 4 0 010 8z"
          />
        </svg>
        <p className="text-sm">You have no transaction history yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-[#2e2c33] rounded-xl p-4 text-white">
      <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
      <ul className="space-y-3">
        {history.map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center border-b border-gray-600 pb-2"
          >
            <div>
              <p className="font-medium">{item.description}</p>
              <p className="text-xs text-gray-400">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
            <p
              className={`font-bold ${
                item.type === 'reward' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {item.type === 'reward' ? '+' : '-'}
              {item.amount} TON
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistory;
