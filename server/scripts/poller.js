// server/scripts/poller.js
const { getDB } = require('../db/db');
const fetch = require('node-fetch');

const POLL_INTERVAL = 60 * 1000; // 1 minute

async function fetchTransactionsFromBlockchain(walletAddress, limit = 20) {
  try {
    let response = await fetch(`https://tonapi.io/v2/accounts/${walletAddress}/transactions?limit=${limit}`);
    if (response.ok) {
      const data = await response.json();
      return data.transactions || [];
    }
    response = await fetch(`https://toncenter.com/api/v3/transactions?address=${walletAddress}&limit=${limit}`);
    if (response.ok) {
      const data = await response.json();
      return data.result || [];
    }
    return [];
  } catch (err) {
    console.error(`Fetch error for ${walletAddress}:`, err);
    return [];
  }
}

function formatTransaction(tx) {
  const isIncoming = tx.in_msg && tx.in_msg.source;
  const isOutgoing = tx.out_msgs && tx.out_msgs.length > 0;

  let amount = '0';
  let counterparty = '';

  if (isIncoming) {
    amount = tx.in_msg.value || '0';
    counterparty = tx.in_msg.source || '';
  } else if (isOutgoing) {
    amount = tx.out_msgs[0]?.value || '0';
    counterparty = tx.out_msgs[0]?.destination || '';
  }

  return {
    hash: tx.hash,
    type: isIncoming ? 'received' : 'sent',
    amount: parseInt(amount) / 1e9,
    amount_raw: amount,
    counterparty,
    timestamp: tx.utime * 1000,
    fees: tx.total_fees ? parseInt(tx.total_fees) / 1e9 : 0,
    fees_raw: tx.total_fees || '0',
    success: tx.success || tx.compute?.success || false,
    comment: tx.in_msg?.msg_data?.text || tx.out_msgs?.[0]?.msg_data?.text || '',
    block_id: tx.block_id,
    lt: tx.lt,
    account: tx.account
  };
}

async function pollWallets() {
  const db = getDB();

  db.all(`SELECT DISTINCT wallet_address FROM users WHERE wallet_address IS NOT NULL`, async (err, rows) => {
    if (err) return console.error('DB read error:', err);

    for (const row of rows) {
      const wallet = row.wallet_address;
      const chainTx = await fetchTransactionsFromBlockchain(wallet, 20);
      const formatted = chainTx.map(formatTransaction);

      db.serialize(() => {
        const stmt = db.prepare(`
          INSERT OR IGNORE INTO wallet_transactions
          (wallet_address, hash, type, amount, amount_raw, counterparty, timestamp, fees, fees_raw, success, comment, block_id, lt, account)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        formatted.forEach(tx => {
          stmt.run(wallet, tx.hash, tx.type, tx.amount, tx.amount_raw, tx.counterparty,
            tx.timestamp, tx.fees, tx.fees_raw, tx.success ? 1 : 0, tx.comment, tx.block_id, tx.lt, tx.account);
        });
        stmt.finalize();
      });

      console.log(`Synced ${formatted.length} tx for ${wallet}`);
    }
  });
}

// Run immediately, then repeat
pollWallets();
setInterval(pollWallets, POLL_INTERVAL);
