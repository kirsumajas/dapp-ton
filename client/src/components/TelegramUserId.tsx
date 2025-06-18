
import React, { useEffect, useState } from 'react';
import { getTelegramUserId } from '../utils/getTelegramUser'; // adjust path if needed

const TelegramUserId: React.FC = () => {
  const [telegramId, setTelegramId] = useState<string | null>(null);

  useEffect(() => {
    const id = getTelegramUserId();
    setTelegramId(id);
    console.log('[DEBUG] Telegram ID:', id);
  }, []);

  if (!telegramId) {
    return (
      <div className="text-red-400 text-sm">
        ⚠️ Telegram user ID not found. Please open this app inside Telegram.
      </div>
    );
  }

  return (
    <div className="text-green-400 text-sm">
      ✅ Telegram user ID: <span className="font-mono">{telegramId}</span>
    </div>
  );
};

export default TelegramUserId;
