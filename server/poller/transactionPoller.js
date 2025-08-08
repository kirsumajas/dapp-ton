const db = require('../db/db');
const axios = require('axios');

const TON_API_URL = 'https://tonapi.io/v2/blockchain/accounts';
const POLL_INTERVAL_MS = 60_000; // 1 minute — adjust as needed

/**
 * Fetch new transactions for a wallet and insert + broadcast them.
 */
async function fetchTransactionsForWallet(walletAddress, wss) {
  try {
    const { data } = await axios.get(`${TON_API_URL}/${walletAddress}/transactions?limit=20`);
    if (!data.transactions) return;

    for (const tx of data.transactions) {
      const hash = tx.hash;
      const blockTime = tx.utime * 1000; // seconds → ms
      const type = tx.in_msg?.destination === walletAddress ? 'received' : 'sent';

      // Convert TON amount (nanotons to TON)
      const amountRaw = tx.in_msg?.value || tx.out_msgs?.[0]?.value || '0';
      const amountTON = Number(amountRaw) / 1e9;

      // Counterparty (sender/receiver)
      const counterparty = type === 'received'
        ? tx.in_msg?.source || null
        : tx.out_msgs?.[0]?.destination || null;

      const feesRaw = tx.fee || '0';
      const feesTON = Number(feesRaw) / 1e9;

      // Check if already exists
      const exists = await new Promise((resolve, reject) => {
        db.get(`SELECT 1 FROM transactions WHERE hash = ?`, [hash], (err, row) => {
          if (err) reject(err);
          else resolve(!!row);
        });
      });

      if (exists) continue; // Skip duplicates

      // Insert into DB
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO transactions (
            telegram_id, wallet_address, hash, type, amount, amount_raw,
            counterparty, timestamp, fees, fees_raw, success, comment,
            block_id, lt, account
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            null, // telegram_id (optional — link if known)
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
          ],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });

      // Broadcast via WebSocket
      if (wss) {
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
            comment: tx.in_msg?.message || null
          }
        };
        wss.clients.forEach(client => {
          if (client.readyState === 1) {
            client.send(JSON.stringify(payload));
          }
        });
      }

      console.log(`✅ New TX stored & broadcasted: ${hash}`);
    }
  } catch (error) {
    console.error(`❌ Error fetching TX for ${walletAddress}:`, error.message);
  }
}

/**
 * Start the poller loop.
 */
function startTransactionPoller(wss) {
  console.log(`⏳ Transaction poller started (interval ${POLL_INTERVAL_MS / 1000}s)`);

  setInterval(async () => {
    // Fetch wallet addresses from DB
    db.all(`SELECT DISTINCT wallet_address FROM wallet_links`, async (err, rows) => {
      if (err) {
        console.error('❌ Error fetching wallet list:', err.message);
        return;
      }

      for (const row of rows) {
        await fetchTransactionsForWallet(row.wallet_address, wss);
      }
    });
  }, POLL_INTERVAL_MS);
}

module.exports = { startTransactionPoller };
