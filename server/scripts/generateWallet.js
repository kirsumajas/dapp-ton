const { mnemonicNew, mnemonicToPrivateKey } = require('@ton/crypto');
const { WalletContractV4 } = require('@ton/ton');
const { TonClient, fromNano } = require('@ton/ton');

(async () => {
  // 1. Generate mnemonic and keypair
  const mnemonic = await mnemonicNew();
  const keyPair = await mnemonicToPrivateKey(mnemonic);

  // 2. Create a Wallet V4 contract
  const wallet = WalletContractV4.create({
    workchain: 0,
    publicKey: keyPair.publicKey,
  });

  // 3. Get the address
  const address = wallet.address.toString();
  console.log('Mnemonic:', mnemonic.join(' '));
  console.log('Wallet Address:', address);

  // 4. Optionally connect to testnet and check balance
  const client = new TonClient({ endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC' });
  const balance = await client.getBalance(wallet.address);
  console.log('Balance:', fromNano(balance), 'TON');
})();
