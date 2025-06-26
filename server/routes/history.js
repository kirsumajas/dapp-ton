const express = require('express');
const router = express.Router();
const db = require('../db/db');

// GET /api/wallet/history/:telegramId
router.get('/:telegramId', (req, res) => {
  const { telegramId } = req.params;

  if (!telegramId) {
    return res.status(400).json({ success: false, message: 'telegramId is required' });
  }

  try {
    // Fetch user rewards
    const rewardStmt = db.prepare(`
      SELECT amount, timestamp, task_name 
      FROM user_rewards 
      WHERE telegram_id = ? 
      ORDER BY timestamp DESC
    `);
    const rewards = rewardStmt.all(telegramId).map(r => ({
      type: 'reward',
      amount: r.amount,
      timestamp: r.timestamp,
      description: r.task_name || 'Reward',
    }));

    // Fetch withdrawals
    const withdrawStmt = db.prepare(`
      SELECT amount, timestamp 
      FROM withdrawals 
      WHERE telegram_id = ? 
      ORDER BY timestamp DESC
    `);
    const withdrawals = withdrawStmt.all(telegramId).map(w => ({
      type: 'withdraw',
      amount: w.amount,
      timestamp: w.timestamp,
      description: 'Withdraw to wallet',
    }));

    // Combine & sort
    const history = [...rewards, ...withdrawals].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    res.json({ success: true, history });
  } catch (err) {
    console.error('Failed to fetch transaction history:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
