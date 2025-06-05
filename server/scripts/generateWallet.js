const { mnemonicNew, mnemonicToPrivateKey, WalletContractV4, TonClient } = require('ton');
const { writeFileSync } = require('fs');

async function main() {
  const client = new TonClient({ endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC' }); // or mainnet

  // Generate 24-word mnemonic
  const mnemonic = await mnemonicNew();

  // Get private key
  const keyPair = await mnemonicToPrivateKey(mnemonic);
  const wallet = WalletContractV4.create({ publicKey: keyPair.publicKey, workchain: 0 });

  const address = wallet.address.toString();

  // Save to .env format
  const env = `TREASURY_MNEMONIC="${mnemonic.join(' ')}"\nTREASURY_ADDRESS="${address}"\n`;
  writeFileSync('.env.treasury', env);

  console.log('✅ New treasury wallet generated!');
  console.log('Address:', address);
  console.log('Mnemonic saved to .env.treasury');
}

main();
