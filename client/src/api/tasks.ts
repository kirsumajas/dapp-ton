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

export async function verifyTask(
  telegramId: string,
  taskName: string
): Promise<{
  success: boolean;
  message?: string;
  status: number;
}> {
  // ✅ Always use unified /api/tasks/verify
  const endpoint = `${BASE_API}/api/tasks/verify`;

  try {
    const res = await axios.post(endpoint, { telegramId, taskName });

    return {
      ...res.data,
      status: res.status,
    };
  } catch (err: any) {
    const status = err.response?.status ?? 500;
    const message = err.response?.data?.message ?? 'Unknown error';
    return {
      success: false,
      message,
      status,
    };
  }
}

