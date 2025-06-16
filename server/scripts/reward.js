const { mnemonicToWalletKey, WalletV4, TonClient, internal } = require('@ton/ton');
const { getHttpEndpoint } = require('@orbs-network/ton-access');

require('dotenv').config();

async function rewardUserWithTon(telegramId, amountTon) {
  const mnemonic = process.env.TREASURY_MNEMONIC.split(' ');
  const key = await mnemonicToWalletKey(mnemonic);
  const endpoint = await getHttpEndpoint({ network: 'testnet' });
  const client = new TonClient({ endpoint });

  const sender = WalletV4.create({ publicKey: key.publicKey, workchain: 0 });
  const senderAddress = sender.address;

  const walletContract = client.open(sender);
  const seqno = await walletContract.getSeqno();

  const telegramWalletAddress = await getUserWallet(telegramId); // You must implement this
  if (!telegramWalletAddress) throw new Error('User wallet not found');

  await walletContract.sendTransfer({
    secretKey: key.secretKey,
    seqno,
    messages: [
      internal({
        to: telegramWalletAddress,
        value: `${amountTon} TON`,
        bounce: false
      })
    ]
  });
}

module.exports = { rewardUserWithTon };
