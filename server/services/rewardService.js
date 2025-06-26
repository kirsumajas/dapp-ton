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
  console.log(`--> rewardUserForTask called with telegramId=${telegramId}, taskName=${taskName}`);

  const task = db.prepare('SELECT * FROM tasks WHERE name = ?').get(taskName);
  if (!task) {
    console.error(`[REWARD ERROR] Task not found: ${taskName}`);
    throw new Error('Task not found');
  }

  const completed = db.prepare(
    'SELECT 1 FROM task_completions WHERE telegram_id = ? AND task_name = ?'
  ).get(telegramId, taskName);

  if (completed) {
    console.warn(`[REWARD SKIPPED] Task already completed for ${telegramId}: ${taskName}`);
    throw new Error('Task already completed');
  }

  console.log(`[REWARD] Task found. Proceeding to reward user ${telegramId} with ${task.reward}`);

  // Ensure user exists
  db.prepare('INSERT OR IGNORE INTO users (telegram_id, balance) VALUES (?, 0)').run(telegramId);

  // Insert task completion
  db.prepare(`
    INSERT INTO task_completions (telegram_id, task_name)
    VALUES (?, ?)
  `).run(telegramId, taskName);

  // Log reward
  db.prepare(`
    INSERT INTO user_rewards (telegram_id, amount, reward_type, task_name)
    VALUES (?, ?, 'task', ?)
  `).run(telegramId, task.reward, taskName);

  // Update user balance
  db.prepare(`
    UPDATE users SET balance = balance + ? WHERE telegram_id = ?
  `).run(task.reward, telegramId);

  console.log(`[REWARD SUCCESS] +${task.reward} to ${telegramId} for task: ${taskName}`);
  
  // Update history table
  db.prepare(`
  INSERT INTO history (telegram_id, type, amount, task_name)
  VALUES (?, 'task', ?, ?)
`).run(telegramId, task.reward, taskName);

  return task.reward;
}


module.exports = {
  rewardUserForTask,
};
