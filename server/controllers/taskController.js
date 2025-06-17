const db = require('../db/db');
const { rewardUserWithTon } = require('../scripts/reward');

// Optional: Verification logic based on task name
const verificationHandlers = {
  'subscribe-channel': require('./telegramController').verifyTelegram,
  'follow-x': require('./xController').verifyXFollow
};

exports.verifyAndRewardTask = async (req, res) => {
  const { telegramId, taskName } = req.body;

  if (!telegramId || !taskName) {
    return res.status(400).json({ success: false, message: 'Missing telegramId or taskName' });
  }

  // Check if task exists
  const taskStmt = db.prepare('SELECT * FROM tasks WHERE name = ?');
  const task = taskStmt.get(taskName);

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  // Check if already completed
  const checkStmt = db.prepare('SELECT 1 FROM task_completions WHERE telegram_id = ? AND task_name = ?');
  const alreadyCompleted = checkStmt.get(telegramId, taskName);

  if (alreadyCompleted) {
    return res.status(200).json({ success: false, message: 'Task already completed' });
  }

  // Optional: run a verification handler
  const verify = verificationHandlers[taskName];
  if (verify) {
    const verified = await verify(telegramId);
    if (!verified) {
      console.log('[VERIFY FAILED]', taskName, telegramId);
      return res.status(403).json({ success: false, message: 'Verification failed' });
    }
  }

  // ✅ Ensure user exists to avoid foreign key constraint errors
  db.prepare('INSERT OR IGNORE INTO users (telegram_id, balance) VALUES (?, 0)').run(telegramId);

  // Insert into task_completions
  db.prepare(`
    INSERT INTO task_completions (telegram_id, task_name)
    VALUES (?, ?)
  `).run(telegramId, taskName);

  // Log reward
  db.prepare(`
    INSERT INTO user_rewards (telegram_id, amount, reward_type)
    VALUES (?, ?, ?)
  `).run(telegramId, task.reward, taskName);

  // Optionally update balance (if needed in-app)
  db.prepare(`
    UPDATE users SET balance = balance + ? WHERE telegram_id = ?
  `).run(task.reward, telegramId);

  // Send TON reward on testnet
  try {
    await rewardUserWithTon(telegramId, task.reward);
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Reward failed', error: err.message });
  }

  return res.json({ success: true, message: 'Task verified and reward sent' });
};

exports.getTasksForUser = (req, res) => {
  const telegramId = req.params.telegramId;

  if (!telegramId) {
    return res.status(400).json({ success: false, message: 'Missing telegramId' });
  }

  try {
    const allTasks = db.prepare('SELECT * FROM tasks').all();
    const completed = db.prepare(
      'SELECT task_name FROM task_completions WHERE telegram_id = ?'
    ).all(telegramId);

    const completedNames = new Set(completed.map(t => t.task_name));

    const tasks = allTasks.map(task => ({
      ...task,
      completed: completedNames.has(task.name)
    }));

    return res.json({ success: true, tasks });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};