require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db/db');
const logRoute = require('./routes/log');
app.use('/api/log', logRoute);
const xRoutes = require('./routes/x');
app.use('/api/x', xRoutes);

// Express-rate-limit proxy issue
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

//  Route Imports
const withdrawRoute = require('./routes/withdraw');
const balanceRoutes = require('./routes/balance');
const milestoneRoutes = require('./routes/milestones');
const telegramRoutes = require('./routes/telegram');
const airdropRoutes = require('./routes/airdrop');
const tasksRoutes = require('./routes/tasks');
//  Route Mounts
app.use('/api/withdraw', withdrawRoute);
app.use('/api/balance', balanceRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/telegram', telegramRoutes);
app.use('/api/airdrop', airdropRoutes);
app.use('/api/tasks', tasksRoutes);
//  Server Start
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
