// routes/withdraw.js
const express = require('express');
const router = express.Router();
const { handleWithdraw } = require('../controllers/withdrawController');
const validateInitData = require('../middleware/validateInitData');
const rateLimiter = require('../middleware/rateLimiter');
const db = require('../db/db');

router.post('/withdraw', validateInitData, rateLimiter, handleWithdraw);

router.get('/recommendation/:telegramId', (req, res) => {
  const { telegramId } = req.params;
  const user = db.prepare('SELECT balance FROM users WHERE telegram_id = ?').get(telegramId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const amount = Math.min(user.balance, 0.2);
  res.json({ recommendedAmount: amount });
});

module.exports = router;