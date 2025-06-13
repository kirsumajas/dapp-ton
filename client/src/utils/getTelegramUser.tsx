export function getTelegramUserId(): string | null {
  const params = new URLSearchParams(window.Telegram?.WebApp?.initData || window.location.search);
  const userData = params.get('user') || params.get('initDataUnsafe');

  if (userData) {
    try {
      const user = typeof userData === 'string' ? JSON.parse(userData) : userData;
      return user?.id?.toString() || null;
    } catch (e) {
      console.error('Failed to parse Telegram user data:', e);
      return null;
    }
  }

  return null;
} 
