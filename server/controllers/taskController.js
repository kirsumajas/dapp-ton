const db = require('../db/db');
const { rewardUserForTask } = require('../services/rewardService');
const { isUserSubscribed } = require('./telegramController'); // ✅ use correct function

// Optional task verification logic
const verificationHandlers = {
  'subscribe-channel': isUserSubscribed, // ✅ FIXED: this is now a pure function
  'follow-x': require('./xController').verifyXFollow,
  'quiz': async () => true
};

exports.verifyAndRewardTask = async (req, res) => {
  const { telegramId, taskName } = req.body;

  if (!telegramId || !taskName) {
    return res.status(400).json({ success: false, message: 'Missing telegramId or taskName' });
  }

  try {
    // ✅ Step 1: Check if task is already completed
    const alreadyCompleted = db.prepare(
      'SELECT 1 FROM task_completions WHERE telegram_id = ? AND task_name = ?'
    ).get(telegramId, taskName);

    if (alreadyCompleted) {
      return res.status(409).json({ success: false, message: 'Task already completed' });
    }

    // ✅ Step 2: Perform verification
    const verify = verificationHandlers[taskName];
    if (verify) {
      const result = await verify(telegramId);
      if (!result) {
        console.log(`[VERIFY FAILED] ${taskName} for ${telegramId}`);
        return res.status(403).json({ success: false, message: 'Verification failed' });
      }
    }

    // ✅ Step 3: Reward
    const reward = rewardUserForTask(telegramId, taskName);
    return res.json({ success: true, message: 'Task verified and reward added', reward });
  } catch (err) {
    const status = err.message === 'Task not found' ? 404 : 500;
    return res.status(status).json({ success: false, message: err.message });
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
