// server/controllers/walletController.js - Fixed version
const db = require('../db/db'); // Use the better-sqlite3 instance directly
const fetch = require('node-fetch');

const walletController = {
  // Connect wallet
  connect: async (req, res) => {
    try {
      const { telegram_id, wallet_address } = req.body;

      if (!telegram_id || !wallet_address) {
        return res.status(400).json({ 
          error: 'Telegram ID and wallet address are required' 
        });
      }

      // Check if user exists in users table
      let user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegram_id);

      // If user doesn't exist, create them
      if (!user) {
        const insertUser = db.prepare(`
          INSERT OR IGNORE INTO users (telegram_id, balance, referral_code) 
          VALUES (?, 0, ?)
        `);
        insertUser.run(telegram_id, `REF${telegram_id}`);
      }

      // Insert or update wallet in user_wallets table
      const insertWallet = db.prepare(`
        INSERT OR REPLACE INTO user_wallets (telegram_id, wallet_address) 
        VALUES (?, ?)
      `);
      
      insertWallet.run(telegram_id, wallet_address);

      // Get initial wallet balance (optional)
      let balance = null;
      try {
        const response = await fetch(
          `https://tonapi.io/v2/accounts/${wallet_address}`,
          {
            headers: { 'Accept': 'application/json' }
          }
        );

        if (response.ok) {
          const data = await response.json();
          balance = (parseInt(data.balance) / 1e9).toFixed(4);
        }
      } catch (error) {
        console.log('Could not fetch initial balance:', error.message);
      }

      res.json({
        success: true,
        message: 'Wallet connected successfully',
        wallet_address,
        balance
      });

    } catch (error) {
      console.error('Error connecting wallet:', error);
      res.status(500).json({ 
        error: 'Failed to connect wallet',
        details: error.message 
      });
    }
  },

  // Get wallet info including balance and recent transactions
  getInfo: async (req, res) => {
    try {
      const { telegram_id } = req.params;

      // Get user's wallet from user_wallets table
      const wallet = db.prepare('SELECT wallet_address FROM user_wallets WHERE telegram_id = ?').get(telegram_id);

      if (!wallet || !wallet.wallet_address) {
        return res.status(404).json({ error: 'No wallet connected' });
      }

      let walletInfo = {
        wallet_address: wallet.wallet_address,
        balance: '0',
        status: 'unknown',
        recent_transactions: []
      };

      try {
        // Get balance
        const balanceResponse = await fetch(
          `https://tonapi.io/v2/accounts/${wallet.wallet_address}`,
          {
            headers: { 'Accept': 'application/json' }
          }
        );

        if (balanceResponse.ok) {
          const balanceData = await balanceResponse.json();
          walletInfo.balance = (parseInt(balanceData.balance) / 1e9).toFixed(4);
          walletInfo.status = balanceData.status;
        }

        // Get recent transactions
        const txResponse = await fetch(
          `https://tonapi.io/v2/accounts/${wallet.wallet_address}/transactions?limit=5`,
          {
            headers: { 'Accept': 'application/json' }
          }
        );

        if (txResponse.ok) {
          const txData = await txResponse.json();
          walletInfo.recent_transactions = (txData.transactions || []).map(tx => {
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
              amount: (parseInt(amount) / 1e9).toFixed(4),
              counterparty,
              timestamp: tx.utime * 1000,
              success: tx.success || false
            };
          });
        }
      } catch (fetchError) {
        console.log('Error fetching wallet data:', fetchError.message);
        // Continue with basic wallet info
      }

      res.json({
        success: true,
        ...walletInfo
      });

    } catch (error) {
      console.error('Error getting wallet info:', error);
      res.status(500).json({ 
        error: 'Failed to get wallet info',
        details: error.message 
      });
    }
  },

  // Disconnect wallet
  disconnect: async (req, res) => {
    try {
      const { telegram_id } = req.body;

      // Remove wallet from user_wallets table
      const deleteWallet = db.prepare('DELETE FROM user_wallets WHERE telegram_id = ?');
      deleteWallet.run(telegram_id);

      res.json({
        success: true,
        message: 'Wallet disconnected successfully'
      });

    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      res.status(500).json({ 
        error: 'Failed to disconnect wallet',
        details: error.message 
      });
    }
  },

  // Check if wallet is connected
  checkConnection: async (req, res) => {
    try {
      const { telegram_id } = req.params;

      const wallet = db.prepare('SELECT wallet_address FROM user_wallets WHERE telegram_id = ?').get(telegram_id);

      const isConnected = wallet && wallet.wallet_address ? true : false;

      res.json({
        success: true,
        connected: isConnected,
        wallet_address: isConnected ? wallet.wallet_address : null
      });

    } catch (error) {
      console.error('Error checking wallet connection:', error);
      res.status(500).json({ 
        error: 'Failed to check connection',
        details: error.message 
      });
    }
  }
};

module.exports = walletController;