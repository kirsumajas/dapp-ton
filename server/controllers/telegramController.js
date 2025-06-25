const axios = require('axios');
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_USERNAME = process.env.TELEGRAM_CHANNEL_USERNAME;

// ✅ This is the proper request handler for Express POST
async function verifySubscription(req, res) {
  const { telegramId } = req.body;
  if (!telegramId) {
    return res.status(400).json({ success: false, message: 'Missing telegramId' });
  }

  try {
    const response = await axios.get(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMember`, {
      params: { chat_id: CHANNEL_USERNAME, user_id: telegramId }
    });

    const status = response.data.result.status;
    const isSubscribed = ['member', 'administrator', 'creator'].includes(status);

    if (!isSubscribed) {
      return res.status(403).json({ success: false, message: 'User is not subscribed' });
    }

    return res.json({ success: true, message: 'User is subscribed' });
  } catch (err) {
    console.error('[Telegram Verify Error]', err.response?.data || err.message);
    return res.status(500).json({ success: false, message: 'Telegram API error' });
  }
}

module.exports = {
  verifySubscription,
};
