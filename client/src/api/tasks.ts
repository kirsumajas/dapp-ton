// src/api/tasks.ts
import axios from 'axios';

const BASE_API = import.meta.env.VITE_API_URL;

export async function fetchTaskStatus(telegramId: string, taskName: string): Promise<boolean> {
  try {
    const res = await axios.get(`${BASE_API}/api/tasks/status`, {
      params: { telegramId, taskName },
    });
    return res.data?.completed ?? false;
  } catch (err) {
    console.error('Failed to fetch task status:', err);
    return false;
  }
}

export async function verifyTask(telegramId: string, taskName: string): Promise<{
  success: boolean;
  message?: string;
}> {
  const endpoint =
    taskName === 'subscribe-channel'
      ? `${BASE_API}/api/telegram/verify-subscription`
      : `${BASE_API}/api/tasks/verify`;

  const res = await axios.post(endpoint, { telegramId, taskName });
  return res.data;
}
