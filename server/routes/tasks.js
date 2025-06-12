const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Hardcoded task definitions (you can later move to a DB if needed)
const ALL_TASKS = [
  {
    name: 'subscribe-channel',
    title: 'Subscribe to the Telegram Channel',
    reward: 0.1
  },
  // Future tasks can be added here
];

// GET /api/tasks/:telegramId
router.get('/:telegramId', (req, res) => {
  const { telegramId } = req.params;

  if (!telegramId) {
    return res.status(400).json({ success: false, message: 'Missing telegramId' });
  }

  const stmt = db.prepare(`
    SELECT task_name FROM task_completions WHERE telegram_id = ?
  `);
  const rows = stmt.all(telegramId);
  const completedTasks = rows.map(row => row.task_name);

  const tasksWithStatus = ALL_TASKS.map(task => ({
    ...task,
    completed: completedTasks.includes(task.name)
  }));

  res.json({
    success: true,
    tasks: tasksWithStatus
  });
});

module.exports = router;
