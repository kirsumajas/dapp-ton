const { mnemonicToWalletKey } = require('@ton/crypto');
const { WalletContractV4, TonClient, fromNano } = require('@ton/ton');
const { mnemonicToSeedSync } = require('bip39');
require('dotenv').config();

(async () => {
  const mnemonics = 'insect soccer media risk notice surface panic case wealth face strike mushroom burden gun rail mesh surprise world work public swamp crunch pluck affair'; // Replace with your real one

  const key = await mnemonicToWalletKey(mnemonics.split(' '));

  const client = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  });

  const wallet = WalletContractV4.create({
    workchain: 0,
    publicKey: key.publicKey,
  });

  const address = wallet.address.toString();

  console.log('✅ Address:', address);
  console.log('🔑 Public Key:', key.publicKey.toString('hex'));
  console.log('🗝️ Secret Key:', key.secretKey.toString('hex'));

  const balance = await client.getBalance(wallet.address);
  console.log('💰 Balance:', fromNano(balance));
})();
