import { useEffect, useState } from 'react';
import axios from 'axios';

interface ProgressCardProps {
  season: string;
}

export default function ProgressCard({ season }: ProgressCardProps) {
  const [planned, setPlanned] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [failed, setFailed] = useState(0);
  const [inProgress, setInProgress] = useState(0);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await axios.get(
          `https://dapp-ton-backend.onrender.com/milestones?season=${encodeURIComponent(season)}`
        );
        const data = response.data;

        setPlanned(data.length);
        setCompleted(data.filter((m: any) => m.status === 'completed').length);
        setFailed(data.filter((m: any) => m.status === 'failed').length);
        setInProgress(data.filter((m: any) => m.status === 'in_progress').length);
      } catch (error) {
        console.error('Failed to load milestone progress:', error);
      }
    };

    fetchMilestones();
  }, [season]);

  const completedRatio = planned > 0 ? completed / planned : 0;
  const failedRatio = planned > 0 ? failed / planned : 0;

  return (
    <div className="bg-[#2e2c33] rounded-xl p-4 mx-3 text-white text-sm space-y-3">
      <div className="font-bold text-gray-400">Progress</div>

      {/* Stacked Progress Bar */}
      <div className="w-full h-5 bg-gray-600 rounded overflow-hidden relative">
        <div
          className="h-full bg-accent-g absolute left-0 top-0 transition-all duration-500"
          style={{ width: `${completedRatio * 100}%` }}
        />
        <div
          className="h-full bg-red-500 absolute top-0 transition-all duration-500"
          style={{
            left: `${completedRatio * 100}%`,
            width: `${failedRatio * 100}%`,
          }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-y-1 pt-2 text-white/80 text-sm">
        <div>Planned</div>
        <div className="text-right">{planned}</div>

        <div>Completed</div>
        <div className="text-right">{completed}</div>

        <div>Failed</div>
        <div className="text-right">{failed}</div>

        <div>In progress</div>
        <div className="text-right">{inProgress}</div>
      </div>
    </div>
  );
}
