const express = require('express');
const router = express.Router();
const db = require('../db/db');
const rateLimiter = require('../middleware/rateLimiter');
const fetch = require('node-fetch'); // Make sure node-fetch is installed if you use Node <18

// Fetch transactions from TON blockchain APIs
async function fetchTransactionsFromBlockchain(walletAddress, limit = 20) {
  try {
    // Try TON API first (tonapi.io)
    let response = await fetch(
      `https://tonapi.io/v2/accounts/${walletAddress}/transactions?limit=${limit}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.transactions || [];
    }

    // Fallback to TONCenter API
    response = await fetch(
      `https://toncenter.com/api/v3/transactions?address=${walletAddress}&limit=${limit}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.result || [];
    }

    throw new Error('Both TON APIs are unavailable');

  } catch (error) {
    console.error('Error fetching from blockchain APIs:', error);
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }
}

// Format transaction for consistent output
function formatTransaction(tx) {
  const isIncoming = tx.in_msg && tx.in_msg.source;
  const isOutgoing = tx.out_msgs && tx.out_msgs.length > 0;

  let amount = '0';
  let counterparty = '';

  if (isIncoming && tx.in_msg) {
    amount = tx.in_msg.value || '0';
    counterparty = tx.in_msg.source || '';
  } else if (isOutgoing && tx.out_msgs[0]) {
    amount = tx.out_msgs[0].value || '0';
    counterparty = tx.out_msgs[0].destination || '';
  }

  return {
    hash: tx.hash,
    type: isIncoming ? 'received' : 'sent',
    amount: (parseInt(amount) / 1e9).toFixed(4), // Convert from nanotons to TON
    amount_raw: amount,
    counterparty,
    timestamp: tx.utime * 1000,
    fees: tx.total_fees ? (parseInt(tx.total_fees) / 1e9).toFixed(6) : '0',
    fees_raw: tx.total_fees || '0',
    success: tx.success || tx.compute?.success || false,
    comment: tx.in_msg?.msg_data?.text || tx.out_msgs?.[0]?.msg_data?.text || '',
    block_id: tx.block_id,
    lt: tx.lt,
    account: tx.account
  };
}

// Get transactions for a user's connected wallet
router.get('/user/:telegram_id', rateLimiter, async (req, res) => {
  try {
    const { telegram_id } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    // Get user's connected wallet from the user_wallets table
    const wallet = db.prepare('SELECT wallet_address FROM user_wallets WHERE telegram_id = ?').get(telegram_id);

    if (!wallet || !wallet.wallet_address) {
      return res.status(404).json({ error: 'No wallet connected for this user' });
    }

    // Fetch transactions from blockchain
    const transactions = await fetchTransactionsFromBlockchain(
      wallet.wallet_address,
      parseInt(limit) + parseInt(offset) // Fetch extra for pagination offset
    );

    // Format transactions
    const formattedTransactions = transactions.map(tx => formatTransaction(tx));

    // Apply pagination
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedTransactions = formattedTransactions.slice(startIndex, endIndex);

    res.json({
      success: true,
      transactions: paginatedTransactions,
      total: formattedTransactions.length,
      wallet_address: wallet.wallet_address,
      has_more: endIndex < formattedTransactions.length
    });

  } catch (error) {
    console.error('Error fetching user transactions:', error);
    res.status(500).json({
      error: 'Failed to fetch transactions',
      details: error.message
    });
  }
});

// Get transactions by wallet address directly
router.get('/wallet/:wallet_address', rateLimiter, async (req, res) => {
  try {
    const { wallet_address } = req.params;
    const { limit = 20 } = req.query;

    if (!wallet_address) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    const transactions = await fetchTransactionsFromBlockchain(wallet_address, parseInt(limit));
    const formattedTransactions = transactions.map(tx => formatTransaction(tx));

    res.json({
      success: true,
      transactions: formattedTransactions,
      wallet_address,
      count: formattedTransactions.length
    });

  } catch (error) {
    console.error('Error fetching wallet transactions:', error);
    res.status(500).json({
      error: 'Failed to fetch transactions',
      details: error.message
    });
  }
});

// Get transaction details by hash
router.get('/details/:hash', rateLimiter, async (req, res) => {
  try {
    const { hash } = req.params;

    const response = await fetch(
      `https://tonapi.io/v2/transactions/${hash}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const transaction = await response.json();
    const formatted = formatTransaction(transaction);

    res.json({
      success: true,
      transaction: formatted
    });

  } catch (error) {
    console.error('Error fetching transaction details:', error);
    res.status(500).json({
      error: 'Failed to fetch transaction details',
      details: error.message
    });
  }
});

// Get wallet balance for user
router.get('/balance/:telegram_id', rateLimiter, async (req, res) => {
  try {
    const { telegram_id } = req.params;

    // Get user's wallet from user_wallets table
    const user = db.prepare('SELECT wallet_address FROM user_wallets WHERE telegram_id = ?').get(telegram_id);

    if (!user || !user.wallet_address) {
      return res.status(404).json({ error: 'No wallet connected' });
    }

    // Get balance from TON API
    const response = await fetch(
      `https://tonapi.io/v2/accounts/${user.wallet_address}`,
      {
        headers: { 'Accept': 'application/json' }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch balance');
    }

    const data = await response.json();

    res.json({
      success: true,
      wallet_address: user.wallet_address,
      balance: (parseInt(data.balance) / 1e9).toFixed(4), // Convert to TON
      balance_raw: data.balance,
      status: data.status
    });

  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({
      error: 'Failed to fetch balance',
      details: error.message
    });
  }
});

module.exports = router;