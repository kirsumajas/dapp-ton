import React from 'react';

interface TaskCardProps {
  icon: React.ReactNode;
  title: string;
  reward: string;
  onStart?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ icon, title, reward, onStart }) => {
  return (
    <div className="bg-[#2e2c33] rounded-2xl p-4 mb-4 w-full max-w-md mx-auto text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon}
          <span className="text-base">{title}</span>
        </div>
        <span className="text-base font-medium flex items-center gap-2">
          <span className="text-gray-400">.......................</span>
          {reward}
        </span>
      </div>
      <div className="mt-6">
        <button
          onClick={onStart}
          className="w-28 h-11 rounded-xl border border-white bg-[#ffffff0a] text-white backdrop-blur-md"
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
