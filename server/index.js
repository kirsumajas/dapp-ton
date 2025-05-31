require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Telegram subscription check
app.post('/check-subscription', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const response = await axios.get(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatMember`,
      {
        params: {
          chat_id: process.env.CHANNEL_USERNAME,
          user_id: userId,
        },
      }
    );

    const isMember = response.data.result.status !== 'left';
    res.json({ subscribed: isMember });
  } catch (error) {
    console.error('Error checking subscription:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to check subscription' });
  }
});

// Get milestones (optionally filtered by season)
app.get('/milestones', (req, res) => {
  const { season } = req.query;
  const stmt = season
    ? db.prepare('SELECT * FROM milestones WHERE season = ?')
    : db.prepare('SELECT * FROM milestones');
  const milestones = season ? stmt.all(season) : stmt.all();
  res.json(milestones);
});

// Add a new milestone (with optional status)
app.post('/milestones', (req, res) => {
  const { season, title, description, deadline, status = 'active' } = req.body;

  const validStatuses = ['active', 'in_progress', 'completed', 'failed'];
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

// Update milestone status
app.patch('/milestones/:id/status', (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
