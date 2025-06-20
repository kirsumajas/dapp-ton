// src/handlers/taskHandler.ts
import { verifyTask } from '../api/tasks';

export async function checkAndVerifyTask({
  telegramId,
  taskName,
}: {
  telegramId: string;
  taskName: string;
}): Promise<'already' | 'completed' | 'not-subscribed' | 'error' | 'success'> {
  try {
    const res = await verifyTask(telegramId, taskName);

    if (res.success) {
      return 'success';
    }

    const msg = res.message?.toLowerCase() ?? '';
    if (msg.includes('already')) return 'already';
    if (msg.includes('not subscribed')) return 'not-subscribed';

    return 'error';
  } catch (err) {
    console.error('Verification error:', err);
    return 'error';
  }
}
