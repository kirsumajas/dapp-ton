const db = require('./db');

function getUser(telegramId) {
  const stmt = db.prepare('SELECT * FROM users WHERE telegram_id = ?');
  return stmt.get(telegramId);
}

function addTaskReward(telegramId, amount, taskName) {
  const insertUser = db.prepare('INSERT OR IGNORE INTO users (telegram_id, balance) VALUES (?, 0)');
  insertUser.run(telegramId);

  const checkTask = db.prepare('SELECT 1 FROM task_completions WHERE telegram_id = ? AND task_name = ?');
  const taskAlreadyDone = checkTask.get(telegramId, taskName);
  if (taskAlreadyDone) return;

  const updateBalance = db.prepare('UPDATE users SET balance = balance + ? WHERE telegram_id = ?');
  updateBalance.run(amount, telegramId);

  const logTask = db.prepare('INSERT INTO task_completions (telegram_id, task_name) VALUES (?, ?)');
  logTask.run(telegramId, taskName);
}

module.exports = {
  getUser,
  addTaskReward
};
