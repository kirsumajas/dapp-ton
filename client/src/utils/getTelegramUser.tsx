export function getTelegramUserName(): string | null {
  const tg = window.Telegram?.WebApp;
  const user = tg?.initDataUnsafe?.user;

  if (user && user.username) {
    return user.username;
  }

  console.warn('Telegram username not found in initDataUnsafe');
  return null;
}

export function getTelegramUserId(): string | null {
  const tg = window.Telegram?.WebApp;
  const user = tg?.initDataUnsafe?.user;

  if (user && user.id) {
    return user.id.toString();
  }

  console.warn('Telegram user ID not found in initDataUnsafe');
  return null;
}

