// server/controllers/walletController.js - Enhanced version with transaction support
const { getDB } = require('../db/db');

const walletController = {
  // Connect wallet (your existing function enhanced)
  connect: async (req, res) => {
    try {
      const { telegram_id, wallet_address } = req.body;

      if (!telegram_id || !wallet_address) {
        return res.status(400).json({ 
          error: 'Telegram ID and wallet address are required' 
        });
      }

      const db = getDB();

      // Check if user exists
      const user = await new Promise((resolve, reject) => {
        db.get(
          'SELECT * FROM users WHERE telegram_id = ?',
          [telegram_id],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update user with wallet address
      await new Promise((resolve, reject) => {
        db.run(
          'UPDATE users SET wallet_address = ?, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = ?',
          [wallet_address, telegram_id],
          function(err) {
            if (err) reject(err);
            else resolve(this.changes);
          }
        );
      });

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
      const db = getDB();

      // Get user's wallet
      const user = await new Promise((resolve, reject) => {
        db.get(
          'SELECT wallet_address FROM users WHERE telegram_id = ?',
          [telegram_id],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });

      if (!user || !user.wallet_address) {
        return res.status(404).json({ error: 'No wallet connected' });
      }

      let walletInfo = {
        wallet_address: user.wallet_address,
        balance: '0',
        status: 'unknown',
        recent_transactions: []
      };

      try {
        // Get balance
        const balanceResponse = await fetch(
          `https://tonapi.io/v2/accounts/${user.wallet_address}`,
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
          `https://tonapi.io/v2/accounts/${user.wallet_address}/transactions?limit=5`,
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
      const db = getDB();

      // Remove wallet from user
      await new Promise((resolve, reject) => {
        db.run(
          'UPDATE users SET wallet_address = NULL, updated_at = CURRENT_TIMESTAMP WHERE telegram_id = ?',
          [telegram_id],
          function(err) {
            if (err) reject(err);
            else resolve(this.changes);
          }
        );
      });

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
      const db = getDB();

      const user = await new Promise((resolve, reject) => {
        db.get(
          'SELECT wallet_address FROM users WHERE telegram_id = ?',
          [telegram_id],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          }
        );
      });

      const isConnected = user && user.wallet_address ? true : false;

      res.json({
        success: true,
        connected: isConnected,
        wallet_address: isConnected ? user.wallet_address : null
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