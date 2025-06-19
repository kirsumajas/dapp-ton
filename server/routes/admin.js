const express = require('express');
const db = require('../db/db');
const router = express.Router();

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users and their balances
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', (req, res) => {
  try {
    const stmt = db.prepare('SELECT telegram_id, balance FROM users ORDER BY balance DESC');
    const users = stmt.all();
    res.json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get user statistics
 *     responses:
 *       200:
 *         description: Basic stats
 */
router.get('/stats', (req, res) => {
  try {
    const total = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const totalBalance = db.prepare('SELECT SUM(balance) as total FROM users').get().total || 0;
    res.json({ totalUsers: total, totalBalance });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
