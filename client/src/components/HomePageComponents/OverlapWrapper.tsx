import { useEffect, useState } from 'react';
import axios from 'axios';
import MilestoneCard from './MilestoneCard';

export interface OverlapWrapperProps {
  season: string;
}

export interface Milestone {
  id: number;
  title: string;
  description: string;
  deadline?: string;
  status: 'active' | 'in_progress' | 'completed' | 'failed';
  season: string;
}

export default function OverlapWrapper({ season }: OverlapWrapperProps) {
  const [visible, setVisible] = useState(true);
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await axios.get(
          `https://dapp-ton-backend.onrender.com/milestones?season=${encodeURIComponent(season)}`
        );
        setMilestones(response.data);
      } catch (error) {
        console.error('Failed to fetch milestones:', error);
      }
    };

    setVisible(false);
    const timeout = setTimeout(() => {
      fetchMilestones();
      setVisible(true);
    }, 200);

    return () => clearTimeout(timeout);
  }, [season]);

  return (
    <div
      className={`transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col gap-2 px-3">
        {milestones.map((milestone) => (
          <MilestoneCard
            key={milestone.id}
            title={milestone.title}
            description={milestone.description}
          />
        ))}
      </div>
    </div>
  );
}
