import { useEffect, useState } from 'react';
import { fetchNotcoinPoolStats } from '../../lib/stonfi';

export default function JettonStats() {
  const [stats, setStats] = useState<{
    priceUsd: number;
    liquidityUsd: number;
    reserveNot: number;
    reserveTon: number;
  } | null>(null);

  useEffect(() => {
    fetchNotcoinPoolStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) return <p className="text-gray-700">Loading Jetton stats...</p>;

  return (
    <div className="bg-gray-900 text-white rounded-lg p-4 text-center shadow">
      <p>💰 <strong>Price (USD):</strong> ${stats.priceUsd.toFixed(6)}</p>
      <p>🏦 <strong>Liquidity (TVL):</strong> ${stats.liquidityUsd.toLocaleString()}</p>
      <p>📦 <strong>Reserves:</strong> {stats.reserveNot.toLocaleString()} NOT / {stats.reserveTon.toLocaleString()} TON</p>
    </div>
  );
} 
