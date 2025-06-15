import React, { useState } from 'react';
import axios from 'axios';

interface TaskCardProps {
  icon: React.ReactNode;
  title: string;
  reward: string;
  taskName: string;
  telegramId: string;
  onStart?: () => void;
  onSuccess?: () => void; // refetch tasks or balance
}

const TaskCard: React.FC<TaskCardProps> = ({ icon, title, reward, taskName, telegramId, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStart = async () => {
    setIsProcessing(true);
    try {
      const res = await axios.post('/api/tasks/verify', {
        telegramId,
        taskName
      });

      if (res.data.success) {
        alert('✅ Task completed & reward added!');
        onSuccess?.();
      } else {
        alert('⚠️ Task verification failed or already completed.');
      }
    } catch (err) {
      console.error('Error verifying task:', err);
      alert('❌ Something went wrong.');
    } finally {
      setIsProcessing(false);
    }
  };

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
          onClick={handleStart}
          className="w-28 h-11 rounded-xl border border-white bg-[#ffffff0a] text-white backdrop-blur-md"
          disabled={isProcessing}
        >
          {isProcessing ? 'Checking...' : 'Start'}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
