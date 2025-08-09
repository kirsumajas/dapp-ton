import React, { useEffect, useState, useRef } from 'react';

interface Transaction {
  id: number;
  type: string;
  amount: number;
  counterparty: string;
  timestamp: string; // or Date, depending on your backend
  comment?: string;
  hash?: string;
}

interface Props {
  telegramId: string;
  walletAddress: string;
}

const WS_URL = 'wss://dapp-ton-backend.onrender.com/ws/transactions';

const TransactionList: React.FC<Props> = ({ telegramId, walletAddress }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch initial transactions via REST API
  useEffect(() => {
    if (!telegramId || !walletAddress) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`https://dapp-ton-backend.onrender.com/api/transactions/${telegramId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch transactions');
        return res.json();
      })
      .then((data: Transaction[]) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch transactions error:', err);
        setLoading(false);
      });
  }, [telegramId, walletAddress]);

  // Setup WebSocket for live updates
  useEffect(() => {
    if (!telegramId || !walletAddress) {
      return;
    }

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('WebSocket connected');
      // Optionally send auth or subscribe message if needed
      ws.send(JSON.stringify({ action: 'subscribe', telegramId, walletAddress }));
    };

    ws.onmessage = (event) => {
      try {
        const newTx: Transaction = JSON.parse(event.data);
        setTransactions((prev) => [newTx, ...prev]);
      } catch (e) {
        console.error('WebSocket message parse error:', e);
      }
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    wsRef.current = ws;

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [telegramId, walletAddress]);

  if (!telegramId || !walletAddress) {
    return <p className="text-center text-gray-500">Connect wallet and authorize Telegram to see transactions.</p>;
  }

  if (loading) {
    return <p className="text-center">Loading transactions...</p>;
  }

  if (transactions.length === 0) {
    return <p className="text-center text-gray-500">No transactions found.</p>;
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
      <ul>
        {transactions.map(({ id, type, amount, counterparty, timestamp, comment, hash }) => (
          <li key={id} className="border-b py-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{type}</span>
              <span>{amount} CHOP</span>
            </div>
            <div className="text-xs text-gray-600">
              <div>Counterparty: {counterparty}</div>
              <div>At: {new Date(timestamp).toLocaleString()}</div>
              {comment && <div>Comment: {comment}</div>}
              {hash && (
                <div>
                  Tx Hash: <a href={`https://tonscan.org/tx/${hash}`} target="_blank" rel="noreferrer" className="underline text-blue-600">{hash.slice(0, 10)}...</a>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;

