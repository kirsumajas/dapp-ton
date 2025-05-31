import { useEffect, useState } from 'react';
import axios from 'axios';

interface SeasonGoalsProps {
  season: string;
}

interface Goal {
  id: number;
  title: string;
  description: string;
}

export default function SeasonGoals({ season }: SeasonGoalsProps) {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get(
          `https://dapp-ton-backend.onrender.com/goals?season=${encodeURIComponent(season)}`
        );
        setGoals(response.data);
      } catch (error) {
        console.error('Failed to fetch goals:', error);
      }
    };

    fetchGoals();
  }, [season]);

  return (
    <section className="px-3 mb-10">
      <h2 className="text-xl font-bold text-white mb-4">Season Goals</h2>
      <div className="flex flex-col gap-3">
        {goals.map(goal => (
          <div
            key={goal.id}
            className="bg-[#2e2c33] rounded-xl p-4 text-white"
          >
            <h3 className="font-bold text-lg mb-1">{goal.title}</h3>
            <p className="text-sm text-white/80">{goal.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
