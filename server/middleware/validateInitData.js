const crypto = require('crypto');

function checkTelegramInitData(initData, botToken) {
  const parsed = new URLSearchParams(initData);
  const hash = parsed.get('hash');
  parsed.delete('hash');

  const sorted = [...parsed.entries()].sort().map(([k, v]) => `${k}=${v}`).join('\n');
  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  const hmac = crypto.createHmac('sha256', secretKey).update(sorted).digest('hex');

  return hmac === hash;
}

module.exports = (req, res, next) => {
  const initData = req.headers['x-telegram-initdata'];
  if (!initData || !checkTelegramInitData(initData, process.env.BOT_TOKEN)) {
    return res.status(403).json({ error: 'Invalid Telegram initData' });
  }

  next();
};
