const db2 = require('../db');
exports.handleAirdropClaim = async (req, res) => {
  const { telegramId, toAddress } = req.body;
  if (!telegramId || !toAddress) {
    return res.status(400).json({ error: 'telegramId and toAddress are required' });
  }

  const alreadyClaimed = db2.prepare('SELECT 1 FROM airdrop_claims WHERE telegram_id = ? OR wallet_address = ?').get(telegramId, toAddress);
  if (alreadyClaimed) {
    return res.status(409).json({ error: 'Airdrop already claimed' });
  }

  try {
    const mnemonic = process.env.AIRDROP_MNEMONIC.split(' ');
    const keyPair = await mnemonicToWalletKey(mnemonic);
    const client = await getTonClient();
    const wallet = WalletContractV4.create({ workchain: 0, publicKey: keyPair.publicKey });
    const contract = client.open(wallet);
    const seqno = await contract.getSeqno();

    await contract.sendTransfer({
      secretKey: keyPair.secretKey,
      seqno,
      messages: [internal({ to: toAddress, value: toNano('0.1'), bounce: false })],
    });

    db2.prepare('INSERT INTO airdrop_claims (telegram_id, wallet_address, claimed_at) VALUES (?, ?, datetime(\'now\'))')
      .run(telegramId, toAddress);

    res.json({ success: true, message: 'Airdrop sent' });
  } catch (err) {
    console.error('Airdrop error:', err);
    res.status(500).json({ error: 'Airdrop failed' });
  }
};

