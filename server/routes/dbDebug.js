// server/routes/dbDebug.js
const express = require('express');
const router = express.Router();
const db = require('../db/db');

// List all tables in the DB
router.get('/tables', (req, res) => {
  console.log('[DB] /tables requested');
  db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, rows) => {
    if (err) {
      console.error('[DB] Error fetching table list:', err);
      return res.status(500).json({ error: 'Failed to fetch table list' });
    }
    const tables = rows.map(r => r.name);
    console.log('[DB] Tables:', tables);
    res.json(tables);
  });
});

// Get table schema info
router.get('/schema/:table', (req, res) => {
  const table = req.params.table;
  console.log(`[DB] /schema/${table} requested`);
  db.all(`PRAGMA table_info(${table})`, (err, rows) => {
    if (err) {
      console.error(`[DB] Error fetching schema for ${table}:`, err);
      return res.status(500).json({ error: 'Failed to fetch table schema' });
    }
    console.log(`[DB] Schema for ${table}:`, rows);
    res.json(rows);
  });
});

// Get sample rows from a table, limit via query param (default 10)
router.get('/table/:table/rows', (req, res) => {
  const table = req.params.table;
  const limit = parseInt(req.query.limit) || 10;
  console.log(`[DB] /table/${table}/rows requested, limit=${limit}`);

  db.all(`SELECT * FROM ${table} LIMIT ?`, [limit], (err, rows) => {
    if (err) {
      console.error(`[DB] Error fetching rows from ${table}:`, err);
      return res.status(500).json({ error: `Failed to fetch rows from ${table}` });
    }
    console.log(`[DB] Rows from ${table}:`, rows);
    res.json(rows);
  });
});

// Health check: simple query to test DB connection
router.get('/health', (req, res) => {
  db.get('SELECT 1', (err) => {
    if (err) {
      console.error('[DB] Health check failed:', err);
      return res.status(500).json({ status: 'error', details: err.message });
    }
    console.log('[DB] Health check passed');
    res.json({ status: 'ok' });
  });
});

module.exports = router;
