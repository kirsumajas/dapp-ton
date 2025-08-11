// server/routes/dbDebug.js - Fixed for better-sqlite3
const express = require('express');
const router = express.Router();
const db = require('../db/db'); // This should be the better-sqlite3 instance

// List all tables in the DB
router.get('/tables', (req, res) => {
  try {
    console.log('[DB] /tables requested');
    const rows = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
    const tables = rows.map(r => r.name);
    console.log('[DB] Tables:', tables);
    res.json(tables);
  } catch (err) {
    console.error('[DB] Error fetching table list:', err);
    res.status(500).json({ error: 'Failed to fetch table list', details: err.message });
  }
});

// Get table schema info
router.get('/schema/:table', (req, res) => {
  try {
    const table = req.params.table;
    console.log(`[DB] /schema/${table} requested`);
    const rows = db.prepare(`PRAGMA table_info(${table})`).all();
    console.log(`[DB] Schema for ${table}:`, rows);
    res.json(rows);
  } catch (err) {
    console.error(`[DB] Error fetching schema for ${req.params.table}:`, err);
    res.status(500).json({ error: 'Failed to fetch table schema', details: err.message });
  }
});

// Get sample rows from a table, limit via query param (default 10)
router.get('/table/:table/rows', (req, res) => {
  try {
    const table = req.params.table;
    const limit = parseInt(req.query.limit) || 10;
    console.log(`[DB] /table/${table}/rows requested, limit=${limit}`);

    const rows = db.prepare(`SELECT * FROM ${table} LIMIT ?`).all(limit);
    console.log(`[DB] Rows from ${table}:`, rows);
    res.json(rows);
  } catch (err) {
    console.error(`[DB] Error fetching rows from ${req.params.table}:`, err);
    res.status(500).json({ error: `Failed to fetch rows from ${req.params.table}`, details: err.message });
  }
});

// Health check: simple query to test DB connection
router.get('/health', (req, res) => {
  try {
    db.prepare('SELECT 1').get();
    console.log('[DB] Health check passed');
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('[DB] Health check failed:', err);
    res.status(500).json({ status: 'error', details: err.message });
  }
});

// WALLET-SPECIFIC DEBUG ROUTES

// Check specific user's wallet data
router.get('/wallet-debug/:telegram_id', (req, res) => {
  try {
    const { telegram_id } = req.params;
    console.log(`[DB] Wallet debug for telegram_id: ${telegram_id}`);
    
    // Check all relevant tables
    const user = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegram_id);
    const wallet = db.prepare('SELECT * FROM user_wallets WHERE telegram_id = ?').get(telegram_id);
    const airdropClaim = db.prepare('SELECT * FROM airdrop_claims WHERE telegram_id = ?').get(telegram_id);
    
    // Get sample data from all tables
    const allUsers = db.prepare('SELECT * FROM users LIMIT 5').all();
    const allWallets = db.prepare('SELECT * FROM user_wallets LIMIT 5').all();
    const allAirdrops = db.prepare('SELECT * FROM airdrop_claims LIMIT 5').all();
    
    console.log(`[DB] Found user:`, user);
    console.log(`[DB] Found wallet:`, wallet);
    console.log(`[DB] Found airdrop:`, airdropClaim);
    
    res.json({
      telegram_id,
      telegram_id_type: typeof telegram_id,
      found_data: {
        user: user,
        wallet: wallet,
        airdrop: airdropClaim
      },
      sample_data: {
        all_users: allUsers,
        all_wallets: allWallets,
        all_airdrops: allAirdrops
      },
      table_counts: {
        users: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
        user_wallets: db.prepare('SELECT COUNT(*) as count FROM user_wallets').get().count,
        airdrop_claims: db.prepare('SELECT COUNT(*) as count FROM airdrop_claims').get().count
      }
    });
    
  } catch (err) {
    console.error(`[DB] Error in wallet debug:`, err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// Test wallet connection (no auth required)
router.post('/test-wallet-connect', (req, res) => {
  try {
    const { telegram_id, wallet_address } = req.body;
    console.log(`[DB] Testing wallet connection for ${telegram_id} -> ${wallet_address}`);
    
    if (!telegram_id || !wallet_address) {
      return res.status(400).json({ 
        error: 'Both telegram_id and wallet_address are required' 
      });
    }
    
    // Create user if doesn't exist
    const insertUser = db.prepare(`
      INSERT OR IGNORE INTO users (telegram_id, balance, referral_code) 
      VALUES (?, 0, ?)
    `);
    const userResult = insertUser.run(telegram_id, `REF${telegram_id}`);
    console.log('[DB] User insert result:', userResult);
    
    // Insert/update wallet
    const insertWallet = db.prepare(`
      INSERT OR REPLACE INTO user_wallets (telegram_id, wallet_address) 
      VALUES (?, ?)
    `);
    const walletResult = insertWallet.run(telegram_id, wallet_address);
    console.log('[DB] Wallet insert result:', walletResult);
    
    // Verify the data
    const verifyUser = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegram_id);
    const verifyWallet = db.prepare('SELECT * FROM user_wallets WHERE telegram_id = ?').get(telegram_id);
    
    console.log('[DB] Verified user:', verifyUser);
    console.log('[DB] Verified wallet:', verifyWallet);
    
    res.json({
      success: true,
      message: 'Wallet connected successfully',
      results: {
        user_insert: userResult,
        wallet_insert: walletResult
      },
      verification: {
        user: verifyUser,
        wallet: verifyWallet
      }
    });
    
  } catch (err) {
    console.error('[DB] Error in test wallet connect:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// Search for telegram_id variations (in case of type mismatches)
router.get('/search-telegram-id/:telegram_id', (req, res) => {
  try {
    const { telegram_id } = req.params;
    console.log(`[DB] Searching for telegram_id variations: ${telegram_id}`);
    
    // Search in all relevant tables with different type casting
    const userAsString = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(telegram_id);
    const userAsNumber = db.prepare('SELECT * FROM users WHERE telegram_id = ?').get(parseInt(telegram_id));
    
    const walletAsString = db.prepare('SELECT * FROM user_wallets WHERE telegram_id = ?').get(telegram_id);
    const walletAsNumber = db.prepare('SELECT * FROM user_wallets WHERE telegram_id = ?').get(parseInt(telegram_id));
    
    // Get all telegram_ids to see the format
    const allUserIds = db.prepare('SELECT DISTINCT telegram_id FROM users LIMIT 10').all();
    const allWalletIds = db.prepare('SELECT DISTINCT telegram_id FROM user_wallets LIMIT 10').all();
    
    res.json({
      searching_for: telegram_id,
      search_results: {
        user_as_string: userAsString,
        user_as_number: userAsNumber,
        wallet_as_string: walletAsString,
        wallet_as_number: walletAsNumber
      },
      existing_formats: {
        user_telegram_ids: allUserIds,
        wallet_telegram_ids: allWalletIds
      }
    });
    
  } catch (err) {
    console.error('[DB] Error in telegram_id search:', err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

module.exports = router;