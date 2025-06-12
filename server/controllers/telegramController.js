const axios = require('axios');
const { getUser, addTaskReward } = require('../db');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_USERNAME = process.env.TELEGRAM_CHANNEL_USERNAME;
const TASK_REWARD_TON = 0.1;
const TASK_NAME = 'subscribe-channel';

async function verifySubscription(req, res) {
  const { telegramId } = req.body;

  if (!telegramId) {
    return res.status(400).json({ success: false, message: 'telegramId is required' });
  }

  try {
    // Check if user is a member of the channel
    const response = await axios.get(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMember`, {
      params: {
        chat_id: CHANNEL_USERNAME,
        user_id: telegramId,
      },
    });

    const status = response.data.result.status;
    const isSubscribed = ['member', 'administrator', 'creator'].includes(status);

    if (!isSubscribed) {
      return res.status(403).json({ success: false, message: 'User is not subscribed to the channel.' });
    }

    const taskAlreadyDone = checkTaskCompletion(telegramId, TASK_NAME);
    if (taskAlreadyDone) {
      return res.status(409).json({ success: false, message: 'Reward already claimed.' });
    }

    addTaskReward(telegramId, TASK_REWARD_TON, TASK_NAME);

    return res.json({
      success: true,
      message: 'User is subscribed. Reward added.',
      reward: TASK_REWARD_TON,
    });

  } catch (err) {
    console.error('verify-subscription error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to verify subscription.' });
  }
}

// internal helper
function checkTaskCompletion(telegramId, taskName) {
  const stmt = require('../db').db.prepare('SELECT 1 FROM task_completions WHERE telegram_id = ? AND task_name = ?');
  return stmt.get(telegramId, taskName);
}

module.exports = {
  verifySubscription
};
