// server/controllers/xController.js
const db = require('../db/db');
const { sendTonReward } = require('../scripts/reward'); // Make sure this exports a function
const FAKE_TWITTER_USERNAME = 'chop_official';

async function verifyFollowAndReward(req, res) {
  const { telegramId } = req.body;

  if (!telegramId) {
    return res.status(400).json({ success: false, message: 'Missing telegramId' });
  }

  // Fake follow check
  const hasFollowed = true; // Replace with real check later
  if (!hasFollowed) {
    return res.json({ success: false, message: 'User has not followed yet' });
  }

  // Prevent double rewards
  const existing = db
    .prepare('SELECT 1 FROM task_completions WHERE telegram_id = ? AND task_name = ?')
    .get(telegramId, 'follow-x');
  if (existing) {
    return res.status(400).json({ success: false, message: 'Task already completed' });
  }

  // Get wallet
  const wallet = db
    .prepare('SELECT wallet_address FROM user_wallets WHERE telegram_id = ?')
    .get(telegramId);
  if (!wallet) {
    return res.status(400).json({ success: false, message: 'Wallet not found' });
  }

  const rewardAmount = 0.1;

  try {
    // Send TON on testnet
    await sendTonReward(wallet.wallet_address, rewardAmount);

    // Log task completion
    db.prepare(`
      INSERT INTO task_completions (telegram_id, task_name) VALUES (?, ?)
    `).run(telegramId, 'follow-x');

    // Log reward
    db.prepare(`
      INSERT INTO user_rewards (telegram_id, amount, reward_type, task_name)
      VALUES (?, ?, ?, ?)
    `).run(telegramId, rewardAmount, 'task', 'follow-x');

    res.json({ success: true, message: 'Reward sent' });
  } catch (err) {
    console.error('TON Reward Error:', err);
    res.status(500).json({ success: false, message: 'Reward failed', error: err.message });
  }
}

module.exports = { verifyFollowAndReward };
