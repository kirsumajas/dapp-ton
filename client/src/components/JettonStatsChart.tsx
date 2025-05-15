/*import { useState } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

// Sample mock data (replace with real API data later)
const chartDataMap = {
  '7D': [10, 12, 11, 14, 13, 16, 18],
  '30D': Array(30).fill(0).map((_, i) => 10 + Math.sin(i / 3) * 5),
  '1Y': Array(12).fill(0).map((_, i) => 10 + Math.cos(i) * 8),
};

export default function JettonStatsChart() {
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '1Y'>('7D');

  const data = {
    labels: Array(chartDataMap[timeframe].length)
      .fill('')
      .map((_, i) => `${i + 1}`),
    datasets: [
      {
        label: 'Jetton Price',
        data: chartDataMap[timeframe],
        fill: false,
        borderColor: '#4ade80',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { ticks: { color: '#ccc' } },
      y: { ticks: { color: '#ccc' } },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Timeframe Switcher }
      <div className="flex justify-center space-x-4 mb-4">
        {['7D', '30D', '1Y'].map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf as '7D' | '30D' | '1Y')}
            className={`px-4 py-2 rounded ${
              timeframe === tf ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Chart Container (responsive + mobile safe) *}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md h-[300px] overflow-hidden">
        <Line data={data} options={options} />
      </div>

      {/* Stats }
      <div className="text-center text-sm text-gray-400 mt-4 space-y-1">
        <p>💰 Market Cap: $420,000</p>
        <p>📈 24h Volume: $12,500</p>
      </div>
    </div>
  );
}
*/