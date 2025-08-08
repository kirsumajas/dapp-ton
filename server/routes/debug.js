const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Return all tables in the SQLite DB
router.get('/tables', (req, res) => {
  db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, rows) => {
    if (err) {
      console.error('Error fetching table list:', err);
      return res.status(500).json({ error: 'Failed to fetch table list' });
    }
    res.json(rows.map(r => r.name));
  });
});

// Optional: check table schema
router.get('/schema/:table', (req, res) => {
  const table = req.params.table;
  db.all(`PRAGMA table_info(${table})`, (err, rows) => {
    if (err) {
      console.error(`Error fetching schema for ${table}:`, err);
      return res.status(500).json({ error: 'Failed to fetch table schema' });
    }
    res.json(rows);
  });
});

module.exports = router;
