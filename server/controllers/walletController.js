// server/controllers/walletController.js

const db = require('../db/db');

function connectWallet(req, res) {
  const { telegram_id, wallet_address } = req.body;

  if (!telegram_id || !wallet_address) {
    return res
      .status(400)
      .json({ error: 'telegram_id and wallet_address are required' });
  }

  db.prepare(`
    INSERT OR REPLACE INTO user_wallets (telegram_id, wallet_address)
    VALUES (?, ?)
  `).run(telegram_id, wallet_address);

  return res.json({ message: 'Wallet connected!' });
}

module.exports = {
  connectWallet,
};
