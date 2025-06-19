import { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  telegram_id: string;
  balance: number;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, statsRes] = await Promise.all([
          axios.get('/api/admin/users'),
          axios.get('/api/admin/stats'),
        ]);

        setUsers(userRes.data.users);
        setTotalUsers(statsRes.data.totalUsers);
        setTotalBalance(statsRes.data.totalBalance);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 text-white max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="mb-6">
        <p>👥 Total Users: <strong>{totalUsers}</strong></p>
        <p>💰 Total Balance: <strong>{totalBalance.toFixed(2)} CHOP</strong></p>
      </div>

      <div className="overflow-auto rounded-xl border border-white/10">
        <table className="min-w-full table-auto">
          <thead className="bg-white/10">
            <tr>
              <th className="px-4 py-2 text-left">Telegram ID</th>
              <th className="px-4 py-2 text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.telegram_id} className="border-t border-white/10">
                <td className="px-4 py-2 font-mono">{u.telegram_id}</td>
                <td className="px-4 py-2 text-right">{u.balance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
