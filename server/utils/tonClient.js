const { TonClient } = require('@ton/ton');
const { getHttpEndpoint } = require('@orbs-network/ton-access');

let clientInstance = null;

async function getTonClient() {
  if (clientInstance) return clientInstance;

  const endpoint = await getHttpEndpoint({ network: 'testnet' }); // or 'mainnet'
  clientInstance = new TonClient({ endpoint });
  return clientInstance;
}

module.exports = { getTonClient };
