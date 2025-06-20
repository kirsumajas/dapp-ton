// src/components/TasksPageComponents/TaskCard.tsx
import React, { useState, useEffect } from 'react';
import { getTelegramUserId } from '../../utils/getTelegramUser';
import { useBalanceStore } from '../../store/balanceStore';
import { fetchTaskStatus } from '../../api/tasks';
import { checkAndVerifyTask } from '../../handlers/taskHandler';

interface TaskCardProps {
  icon: React.ReactNode;
  title: string;
  reward: string;
  taskName: string;
  telegramId?: string;
  onSuccess?: () => void;
}

const TELEGRAM_CHANNEL_URL =
  import.meta.env.VITE_TELEGRAM_CHANNEL_URL || 'https://t.me/fallback_channel';

const TaskCard: React.FC<TaskCardProps> = ({
  icon,
  title,
  reward,
  taskName,
  telegramId: propTelegramId,
  onSuccess,
}) => {
  const [telegramId, setTelegramId] = useState<string | null>(propTelegramId || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stage, setStage] = useState<'start' | 'verify' | 'completed'>('start');
  const { fetchBalance } = useBalanceStore();

  useEffect(() => {
    const init = async () => {
      const id = propTelegramId || getTelegramUserId();
      setTelegramId(id);
      if (!id) return;

      const completed = await fetchTaskStatus(id, taskName);
      if (completed) setStage('completed');
    };
    init();
  }, [propTelegramId, taskName]);

  const verifyAndReward = async () => {
    if (!telegramId) {
      alert('❌ Telegram ID not found. Please open this app inside Telegram.');
      return false;
    }

    const result = await checkAndVerifyTask({ telegramId, taskName });

    switch (result) {
      case 'success':
        alert('✅ Task completed & reward added!');
        setStage('completed');
        onSuccess?.();
        await fetchBalance(telegramId);
        return true;
      case 'already':
        alert('⚠️ Task already completed.');
        setStage('completed');
        return true;
      case 'not-subscribed':
        return false;
      case 'error':
      default:
        alert('❌ Verification failed.');
        return false;
    }
  };

  const handleStart = async () => {
    setIsProcessing(true);
    const verified = await verifyAndReward();
    if (!verified) {
      window.open(TELEGRAM_CHANNEL_URL, '_blank');
      setStage('verify');
    }
    setIsProcessing(false);
  };

  const handleVerify = async () => {
    setIsProcessing(true);
    const verified = await verifyAndReward();
    if (!verified) {
      alert('🚫 You are still not subscribed. Try again after subscribing.');
    }
    setIsProcessing(false);
  };

  const renderButton = () => {
    if (!telegramId) {
      return (
        <div className="text-red-400 text-sm mt-2">
          ⚠️ Unable to detect your Telegram ID. Please open this app inside Telegram.
        </div>
      );
    }

    if (stage === 'completed') {
      return (
        <button
          disabled
          className="w-28 h-11 rounded-xl border border-green-500 bg-green-800 text-white"
        >
          ✅ Done
        </button>
      );
    }

    if (stage === 'verify') {
      return (
        <button
          onClick={handleVerify}
          disabled={isProcessing}
          className="w-28 h-11 rounded-xl border border-yellow-400 bg-yellow-700 text-white"
        >
          {isProcessing ? 'Checking...' : 'Verify'}
        </button>
      );
    }

    return (
      <button
        onClick={handleStart}
        disabled={isProcessing}
        className="w-28 h-11 rounded-xl border border-white bg-[#ffffff0a] text-white backdrop-blur-md"
      >
        {isProcessing ? 'Checking...' : 'Start'}
      </button>
    );
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
      <div className="mt-6">{renderButton()}</div>
    </div>
  );
};

export default TaskCard;
