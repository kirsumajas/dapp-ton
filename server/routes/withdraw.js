const express = require('express');
const router = express.Router();
const { mnemonicToWalletKey } = require('@ton/crypto');
const { TonClient, WalletContractV4, toNano, internal } = require('@ton/ton');
const { getHttpEndpoint } = require('@orbs-network/ton-access');

router.post('/withdraw', async (req, res) => {
  const { toAddress, amount } = req.body;

  if (!toAddress || !amount) {
    return res.status(400).json({ error: 'toAddress and amount are required' });
  }

  try {
    const mnemonic = process.env.TREASURY_MNEMONIC.split(' ');
    const keyPair = await mnemonicToWalletKey(mnemonic);

    const endpoint = await getHttpEndpoint({ network: 'testnet' });
    const client = new TonClient({ endpoint });

    const wallet = WalletContractV4.create({
      workchain: 0,
      publicKey: keyPair.publicKey,
    });

    const contract = client.open(wallet);
    const seqno = await contract.getSeqno();

    await contract.sendTransfer({
      secretKey: keyPair.secretKey,
      seqno,
      messages: [
        internal({
          to: toAddress,
          value: toNano(amount),
          bounce: false,
        }),
      ],
    });

    return res.json({ success: true, message: 'Transfer initiated' });
  } catch (err) {
    console.error('Withdraw error:', err);
    return res.status(500).json({ error: 'Transfer failed' });
  }
});

module.exports = router;
