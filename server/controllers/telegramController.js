// controllers/telegramController.js

const axios = require('axios');
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_USERNAME = process.env.TELEGRAM_CHANNEL_USERNAME;

async function isUserSubscribed(telegramId) {
  try {
    const response = await axios.get(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMember`, {
      params: { chat_id: CHANNEL_USERNAME, user_id: telegramId }
    });

    const status = response.data.result.status;
    return ['member', 'administrator', 'creator'].includes(status);
  } catch (err) {
    console.error('[Telegram Verify Error]', err.response?.data || err.message);
    return false;
  }
}

module.exports = { isUserSubscribed };

