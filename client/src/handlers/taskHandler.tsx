import { verifyTask } from '../api/tasks';

export async function checkAndVerifyTask({
  telegramId,
  taskName,
}: {
  telegramId: string;
  taskName: string;
}): Promise<'already' | 'not-subscribed' | 'error' | 'success'> {
  try {
    const res = await verifyTask(telegramId, taskName);

    switch (res.status) {
      case 200:
        return 'success';
      case 409:
        return 'already';
      case 403:
        return 'not-subscribed';
      case 404:
        return 'error'; // Task not found
      default:
        return 'error';
    }
  } catch (err) {
    console.error('Verification error:', err);
    return 'error';
  }
}

