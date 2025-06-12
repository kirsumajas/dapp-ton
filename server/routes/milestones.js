const express = require('express');
const router = express.Router();
const db = require('../db/db');

// GET /api/milestones
router.get('/', (req, res) => {
  const { season } = req.query;
  const stmt = season
    ? db.prepare('SELECT * FROM milestones WHERE season = ?')
    : db.prepare('SELECT * FROM milestones');
  const milestones = season ? stmt.all(season) : stmt.all();
  res.json(milestones);
});

// POST /api/milestones
router.post('/', (req, res) => {
  const { season, title, description, deadline, status = 'in_progress' } = req.body;
  const validStatuses = ['in_progress', 'completed', 'failed'];

  if (!season || !title) {
    return res.status(400).json({ error: 'season and title are required' });
  }
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  const stmt = db.prepare(`
    INSERT INTO milestones (season, title, description, deadline, status)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(season, title, description, deadline, status);
  res.json({ id: info.lastInsertRowid });
});

// PATCH /api/milestones/:id/status
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ['in_progress', 'completed', 'failed'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  const stmt = db.prepare('UPDATE milestones SET status = ? WHERE id = ?');
  const result = stmt.run(status, id);
  res.json({ updated: result.changes > 0 });
});

module.exports = router;
