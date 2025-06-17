const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { verifyAndRewardTask } = require('../controllers/taskController');

// Existing route
router.post('/verify', verifyAndRewardTask);

// ✅ New route to manually add tasks via Postman
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

// ✅ Add this new GET endpoint
router.get('/:telegramId', getTasksForUser);

module.exports = router;
