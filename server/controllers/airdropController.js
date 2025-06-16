require('dotenv').config();
const { mnemonicToWalletKey } = require('@ton/crypto');
const { WalletContractV4, TonClient, internal, toNano } = require('@ton/ton');
const db2 = require('../db/db');

// optional: helper to create TON client
async function getTonClient() {
  return new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    apiKey: process.env.TONCENTER_API_KEY,
  });
}

exports.handleAirdropClaim = async (req, res) => {
  const { telegramId, toAddress } = req.body;

  if (!telegramId || !toAddress) {
    return res.status(400).json({ error: 'telegramId and toAddress are required' });
  }

  const alreadyClaimed = db2.prepare(`
    SELECT 1 FROM airdrop_claims WHERE telegram_id = ? OR wallet_address = ?
  `).get(telegramId, toAddress);

  if (alreadyClaimed) {
    return res.status(409).json({ error: 'Airdrop already claimed' });
  }

  try {
    const mnemonic = process.env.TREASURY_MNEMONIC?.split(' ');
    if (!mnemonic || mnemonic.length !== 24) {
      return res.status(500).json({ error: 'Invalid or missing mnemonic' });
    }

    const keyPair = await mnemonicToWalletKey(mnemonic);
    const client = await getTonClient();

    const wallet = WalletContractV4.create({
      workchain: 0,
      publicKey: keyPair.publicKey
    });

    const contract = client.open(wallet);
    const seqno = await contract.getSeqno();

    await contract.sendTransfer({
      secretKey: keyPair.secretKey,
      seqno,
      messages: [
        internal({
          to: toAddress,
          value: toNano('0.1'),
          bounce: false
        })
      ]
    });

    db2.prepare(`
      INSERT INTO airdrop_claims (telegram_id, wallet_address, claimed_at)
      VALUES (?, ?, datetime('now'))
    `).run(telegramId, toAddress);

    res.json({ success: true, message: 'Airdrop sent' });

  } catch (err) {
    console.error('Airdrop error:', err);
    res.status(500).json({ error: 'Airdrop failed' });
  }
};
