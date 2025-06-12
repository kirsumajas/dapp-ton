// controllers/withdrawController.js
const { mnemonicToWalletKey } = require('@ton/crypto');
const { WalletContractV4, toNano, internal } = require('@ton/ton');
const { getTonClient } = require('../utils/tonClient');
const db = require('../db/db');

exports.handleWithdraw = async (req, res) => {
  const { toAddress, amount, telegramId } = req.body;
  if (!toAddress || !amount || !telegramId) {
    return res.status(400).json({ error: 'toAddress, amount, and telegramId are required' });
  }

  const user = db.prepare('SELECT balance FROM users WHERE telegram_id = ?').get(telegramId);
  if (!user || user.balance < amount) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  try {
    const mnemonic = process.env.TREASURY_MNEMONIC.split(' ');
    const keyPair = await mnemonicToWalletKey(mnemonic);
    const client = await getTonClient();
    const wallet = WalletContractV4.create({ workchain: 0, publicKey: keyPair.publicKey });
    const contract = client.open(wallet);
    const seqno = await contract.getSeqno();

    await contract.sendTransfer({
      secretKey: keyPair.secretKey,
      seqno,
      messages: [internal({ to: toAddress, value: toNano(amount), bounce: false })],
    });

    db.prepare('UPDATE users SET balance = balance - ? WHERE telegram_id = ?').run(amount, telegramId);
    db.prepare('INSERT INTO withdrawals (telegram_id, wallet_address, amount) VALUES (?, ?, ?)')
      .run(telegramId, toAddress, amount);

    res.json({ success: true, message: 'Transfer initiated' });
  } catch (err) {
    console.error('Withdraw error:', err);
    res.status(500).json({ error: 'Transfer failed' });
  }
};
