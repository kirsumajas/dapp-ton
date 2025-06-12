const express = require('express');
const router = express.Router();
const db = require('../db/db');

// GET /api/balance/:telegramId
router.get('/:telegramId', (req, res) => {
  const { telegramId } = req.params;
  const stmt = db.prepare('SELECT balance FROM users WHERE telegram_id = ?');
  const user = stmt.get(telegramId);

  if (!user) {
    const insert = db.prepare('INSERT INTO users (telegram_id, balance) VALUES (?, 0)');
    insert.run(telegramId);
    return res.json({ balance: 0 });
  }

  res.json({ balance: user.balance });
});

// POST /api/balance/update
router.post('/update', (req, res) => {
  const { telegramId, amount } = req.body;

  if (!telegramId || typeof amount !== 'number') {
    return res.status(400).json({ error: 'telegramId and amount are required' });
  }

  const stmt = db.prepare(`
    INSERT INTO users (telegram_id, balance) VALUES (?, ?)
    ON CONFLICT(telegram_id) DO UPDATE SET balance = balance + ?
  `);
  stmt.run(telegramId, amount, amount);

  const updated = db.prepare('SELECT balance FROM users WHERE telegram_id = ?').get(telegramId);
  res.json({ balance: updated.balance });
});

module.exports = router;
