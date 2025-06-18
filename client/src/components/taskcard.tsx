import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTelegramUserId } from '../utils/getTelegramUser'; // adjust path if needed

interface TaskCardProps {
  icon: React.ReactNode;
  title: string;
  reward: string;
  taskName: string;
  telegramId?: string; // optional to allow fallback
  onSuccess?: () => void;
}

const TELEGRAM_CHANNEL_URL =
  import.meta.env.VITE_TELEGRAM_CHANNEL_URL || 'https://t.me/fallback_channel';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://your-fallback-url.com';
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

  useEffect(() => {
    if (!propTelegramId) {
      const id = getTelegramUserId();
      setTelegramId(id);
      console.log('[DEBUG] Telegram ID:', id);
    }
  }, [propTelegramId]);

  const verifyAndReward = async () => {
    if (!telegramId) {
      alert('❌ Telegram ID not found. Please open this app inside Telegram.');
      return false;
    }

    try {
      const endpoint =
  taskName === 'subscribe-channel'
    ? `${BACKEND_URL}/api/telegram/verify-subscription`
    : `${BACKEND_URL}/api/tasks/verify`;

      console.log('[DEBUG] Verifying task:', { telegramId, taskName, endpoint });

      const res = await axios.post(endpoint, {
        telegramId,
        taskName,
      });

      if (res.data.success) {
        alert('✅ Task completed & reward added!');
        setStage('completed');
        onSuccess?.();
        return true;
      } else {
        const msg = res.data.message || '';
        if (msg.toLowerCase().includes('not subscribed')) {
          return false;
        }
        if (msg.toLowerCase().includes('already')) {
          alert('⚠️ Task already completed.');
          setStage('completed');
          return true;
        }
        alert('⚠️ Verification failed.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      alert('❌ Something went wrong.');
    }

    return false;
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
