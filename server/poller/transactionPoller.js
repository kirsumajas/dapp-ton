const db = require('../db/db');
const axios = require('axios');
const { pushToUser } = require('../ws'); // Import once at top

const TON_API_URL = 'https://tonapi.io/v2/blockchain/accounts';
const POLL_INTERVAL_MS = 60_000; // 1 minute

// In-memory map to track last seen tx timestamp per wallet
const lastSeenTimestamps = new Map();

/**
 * Fetch new transactions for a wallet since last seen timestamp,
 * store them and broadcast to the connected user (telegramId).
 */
async function fetchTransactionsForWallet(walletAddress, telegramId) {
  try {
    const lastTimestamp = lastSeenTimestamps.get(walletAddress) || 0;

    // Fetch max 20 txs (TON API might not support filtering by timestamp, filter client-side)
    const { data } = await axios.get(`${TON_API_URL}/${walletAddress}/transactions`, {
      params: {
        limit: 20,
      }
    });

    if (!data.transactions) return;

    // Filter new transactions after lastTimestamp
    const newTxs = data.transactions.filter(tx => tx.utime > lastTimestamp);

    if (newTxs.length === 0) return; // nothing new

    for (const tx of newTxs) {
      const hash = tx.hash;
      const blockTime = tx.utime * 1000; // seconds to ms
      // Determine type safely
      const type = tx.in_msg?.destination === walletAddress ? 'received' : 'sent';

      const amountRaw = tx.in_msg?.value || tx.out_msgs?.[0]?.value || '0';
      const amountTON = amountRaw ? Number(amountRaw) / 1e9 : 0;

      const counterparty = type === 'received'
        ? tx.in_msg?.source || null
        : tx.out_msgs?.[0]?.destination || null;

      const feesRaw = tx.fee || '0';
      const feesTON = feesRaw ? Number(feesRaw) / 1e9 : 0;

      // Check if tx already exists in DB
      const exists = db.prepare(`SELECT 1 FROM transactions WHERE hash = ?`).get(hash);

      if (exists) continue; // skip duplicates

      // Insert into DB
      db.prepare(`
        INSERT INTO transactions (
          telegram_id, wallet_address, hash, type, amount, amount_raw,
          counterparty, timestamp, fees, fees_raw, success, comment,
          block_id, lt, account
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        telegramId,
        walletAddress,
        hash,
        type,
        amountTON,
        amountRaw,
        counterparty,
        tx.utime,
        feesTON,
        feesRaw,
        tx.status === 'finalized' ? 1 : 0,
        tx.in_msg?.message || null,
        tx.block_id || null,
        tx.lt || null,
        tx.account || null
      );

      console.log(`✅ New TX stored for wallet ${walletAddress}: ${hash}`);

      // Broadcast only to the user's WS client identified by telegramId
      const payload = {
        event: 'new_transaction',
        data: {
          wallet_address: walletAddress,
          hash,
          type,
          amount: amountTON,
          counterparty,
          timestamp: tx.utime,
          fees: feesTON,
          comment: tx.in_msg?.message || null,
        }
      };

      pushToUser(telegramId, payload.event, payload.data);
    }

    // Update last seen timestamp
    const maxTimestamp = Math.max(...newTxs.map(tx => tx.utime));
    lastSeenTimestamps.set(walletAddress, maxTimestamp);

  } catch (error) {
    console.error(`❌ Error fetching TX for wallet ${walletAddress}:`, error.message);
  }
}

/**
 * Main poller loop - fetch wallets + telegramIds from DB and fetch their new transactions
 */
function startTransactionPoller() {
  console.log(`⏳ Transaction poller started (interval ${POLL_INTERVAL_MS / 1000}s)`);

  setInterval(() => {
    try {
      // Get all wallet + telegramId pairs
      const rows = db.prepare(`SELECT telegram_id, wallet_address FROM user_wallets`).all();

      rows.forEach(({ telegram_id, wallet_address }) => {
        fetchTransactionsForWallet(wallet_address, telegram_id);
      });
    } catch (err) {
      console.error('❌ Error fetching wallet list:', err.message);
    }
  }, POLL_INTERVAL_MS);
}

module.exports = { startTransactionPoller };
