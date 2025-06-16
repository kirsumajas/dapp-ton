export async function logToBackend(level: string, message: string, data?: any, telegramUserId?: number) {
  try {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level,
        message,
        data,
        telegramUserId,
        userAgent: navigator.userAgent,
      }),
    });
  } catch (err) {
    console.warn('Failed to send log to backend:', err);
  }
}
