const express = require('express');
const router = express.Router();
const db = require('../db/db');
const {
  verifyAndRewardTask,
  getTasksForUser
} = require('../controllers/taskController');

/**
 * @swagger
 * /api/tasks/verify:
 *   post:
 *     summary: Verify a task and reward the user
 *     description: Verifies a user's task completion and adds in-app rewards.
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - telegramId
 *               - taskName
 *             properties:
 *               telegramId:
 *                 type: string
 *                 example: "123456789"
 *               taskName:
 *                 type: string
 *                 example: "follow-x"
 *     responses:
 *       200:
 *         description: Reward applied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Task verified and reward added
 *                 reward:
 *                   type: number
 *                   example: 0.1
 *       403:
 *         description: Verification failed
 *       404:
 *         description: Task not found
 *       409:
 *         description: Task already completed
 */
router.post('/verify', verifyAndRewardTask);

// Route to manually add tasks via Postman
router.post('/add', (req, res) => {
  const { name, title, description, reward } = req.body;

  if (!name || !title || !reward) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO tasks (name, title, description, reward)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(name, title, description || '', reward);
    return res.json({ success: true, message: 'Task added' });
  } catch (err) {
    console.error('Error inserting task:', err);
    return res.status(500).json({ success: false, message: 'Failed to add task' });
  }
});

// Route to check if user completed a task
router.get('/status', (req, res) => {
  const { telegramId, taskName } = req.query;

  if (!telegramId || !taskName) {
    return res.status(400).json({ completed: false, message: 'Missing telegramId or taskName' });
  }

  try {
    const stmt = db.prepare(
      'SELECT 1 FROM task_completions WHERE telegram_id = ? AND task_name = ?'
    );
    const row = stmt.get(telegramId, taskName);
    return res.json({ completed: !!row });
  } catch (err) {
    console.error('Error checking task status:', err);
    return res.status(500).json({ completed: false });
  }
});

// Final catch-all route for task listing
router.get('/:telegramId', getTasksForUser);

module.exports = router;
