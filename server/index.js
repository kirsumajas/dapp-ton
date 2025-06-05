require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
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

// Get milestones
app.get('/milestones', (req, res) => {
  const { season } = req.query;
  const stmt = season
    ? db.prepare('SELECT * FROM milestones WHERE season = ?')
    : db.prepare('SELECT * FROM milestones');
  const milestones = season ? stmt.all(season) : stmt.all();
  res.json(milestones);
});

// Add milestone
app.post('/milestones', (req, res) => {
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

// Get user balance
app.get('/balance/:telegramId', (req, res) => {
  const { telegramId } = req.params;
  const stmt = db.prepare('SELECT balance FROM users WHERE telegram_id = ?');
  const user = stmt.get(telegramId);

  if (!user) {
    const insert = db.prepare('INSERT INTO users (telegram_id, balance) VALUES (?, 0)');
    insert.run(telegramId);
    return res.json({ balance: 0 });
  }

  res.json({ balance: user.balance });
});

// Update balance (e.g., earn coins)
app.post('/balance/update', (req, res) => {
  const { telegramId, amount } = req.body;

  if (!telegramId || typeof amount !== 'number') {
    return res.status(400).json({ error: 'telegramId and amount are required' });
  }

  const stmt = db.prepare(`
    INSERT INTO users (telegram_id, balance) VALUES (?, ?)
    ON CONFLICT(telegram_id) DO UPDATE SET balance = balance + ?
  `);
  stmt.run(telegramId, amount, amount);

  const updated = db.prepare('SELECT balance FROM users WHERE telegram_id = ?').get(telegramId);
  res.json({ balance: updated.balance });
});

// Withdraw route (separated)
const withdrawRoute = require('./routes/withdraw');
app.use(withdrawRoute);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
