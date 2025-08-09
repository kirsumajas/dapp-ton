require('dotenv').config();

console.log('[ENV] TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN?.slice(0, 10) + '...');
console.log('[ENV] TELEGRAM_CHANNEL_USERNAME:', process.env.TELEGRAM_CHANNEL_USERNAME);

const express = require('express');
const cors = require('cors');
const http = require('http');
const { initWebSocket } = require('./ws');
const { startTransactionPoller } = require('./poller/transactionPoller');
const debugRoutes = require('./routes/debug');

const app = express();
const server = http.createServer(app);

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/log', require('./routes/log'));
app.use('/api/withdraw', require('./routes/withdraw'));
app.use('/api/balance', require('./routes/balance'));
app.use('/api/milestones', require('./routes/milestones'));
app.use('/api/telegram', require('./routes/telegram'));
app.use('/api/airdrop', require('./routes/airdrop'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/history', require('./routes/history'));
app.use('/api/referral', require('./routes/referral'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/debug', debugRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'connected',
      tonapi: 'available'
    }
  });
});

// Start WS + Poller + Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
});

initWebSocket(server);
startTransactionPoller();

module.exports = app;
