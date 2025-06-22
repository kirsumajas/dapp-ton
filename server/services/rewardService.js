// services/rewardService.js
const db = require('../db/db');

/**
 * Reward a user for completing a task.
 * Handles:
 * - User creation (if missing)
 * - Preventing duplicate rewards
 * - Logging task completion and rewards
 * - Updating in-app balance
 */
function rewardUserForTask(telegramId, taskName) {
  // Fetch task and reward
  const task = db.prepare('SELECT * FROM tasks WHERE name = ?').get(taskName);
  if (!task) {
    throw new Error('Task not found');
  }

  // Check for duplicate completion
  const completed = db.prepare(
    'SELECT 1 FROM task_completions WHERE telegram_id = ? AND task_name = ?'
  ).get(telegramId, taskName);

  if (completed) {
    throw new Error('Task already completed');
  }

  // Ensure user exists
  db.prepare('INSERT OR IGNORE INTO users (telegram_id, balance) VALUES (?, 0)')
    .run(telegramId);

  // Insert completion log
  db.prepare(`
    INSERT INTO task_completions (telegram_id, task_name)
    VALUES (?, ?)
  `).run(telegramId, taskName);

  // Log reward
  db.prepare(`
    INSERT INTO user_rewards (telegram_id, amount, reward_type, task_name)
    VALUES (?, ?, 'task', ?)
  `).run(telegramId, task.reward, taskName);

  // Update balance
  db.prepare(`
    UPDATE users SET balance = balance + ? WHERE telegram_id = ?
  `).run(task.reward, telegramId);

  return task.reward;
}

module.exports = {
  rewardUserForTask,
};
