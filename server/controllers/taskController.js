const db = require('../db/db');

// Optional task verification logic
const verificationHandlers = {
  'subscribe-channel': require('./telegramController').verifyTelegram,
  'follow-x': require('./xController').verifyXFollow,
  'quiz': async () => true // Quiz is client-side only
};

exports.verifyAndRewardTask = async (req, res) => {
  const { telegramId, taskName } = req.body;

  if (!telegramId || !taskName) {
    return res.status(400).json({ success: false, message: 'Missing telegramId or taskName' });
  }

  const task = db.prepare('SELECT * FROM tasks WHERE name = ?').get(taskName);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  const completed = db.prepare('SELECT 1 FROM task_completions WHERE telegram_id = ? AND task_name = ?')
    .get(telegramId, taskName);
  if (completed) {
    return res.status(409).json({ success: false, message: 'Task already completed' });
  }

  // Optional verification logic
  const verify = verificationHandlers[taskName];
  if (verify) {
    const result = await verify(telegramId);
    if (!result) {
      console.log(`[VERIFY FAILED] ${taskName} for ${telegramId}`);
      return res.status(403).json({ success: false, message: 'Verification failed' });
    }
  }

  // Reward via helper
  const { addTaskReward } = require('../db/helpers');
  try {
    addTaskReward(telegramId, task.reward, taskName);
    return res.json({ success: true, message: 'Task verified and reward added' });
  } catch (err) {
    console.error('Reward Error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getTasksForUser = (req, res) => {
  const { telegramId } = req.params;

  if (!telegramId) {
    return res.status(400).json({ success: false, message: 'Missing telegramId' });
  }

  try {
    const allTasks = db.prepare('SELECT * FROM tasks').all();
    const completed = db.prepare('SELECT task_name FROM task_completions WHERE telegram_id = ?')
      .all(telegramId)
      .map(row => row.task_name);

    const completedSet = new Set(completed);
    const tasks = allTasks.map(task => ({
      ...task,
      completed: completedSet.has(task.name)
    }));

    return res.json({ success: true, tasks });
  } catch (err) {
    console.error('Fetch Tasks Error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
