require('dotenv').config();

console.log('[ENV] TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN?.slice(0, 10) + '...');
console.log('[ENV] TELEGRAM_CHANNEL_USERNAME:', process.env.TELEGRAM_CHANNEL_USERNAME);

const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db/db');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');


// Trust proxy (for rate limiting)
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());

// Route Imports
const logRoute = require('./routes/log');
// const xRoutes = require('./routes/x'); ❌ Removed — handled via tasks/verify
const telegramRoutes = require('./routes/telegram');
const withdrawRoute = require('./routes/withdraw');
const balanceRoutes = require('./routes/balance');
const milestoneRoutes = require('./routes/milestones');
const airdropRoutes = require('./routes/airdrop');
const tasksRoutes = require('./routes/tasks');
const adminRoutes = require('./routes/admin');
const historyRoutes = require('./routes/history');
const referralRoutes = require('./routes/referral');
const walletRoutes = require('./routes/wallet');
// Route Mounts
app.use('/api/log', logRoute);
// app.use('/api/x', xRoutes); ❌ Removed
app.use('/api/withdraw', withdrawRoute);
app.use('/api/balance', balanceRoutes);
app.use('/api/milestones', milestoneRoutes);
 // ✅ Can keep if quiz or fallback needed
 app.use('/api/telegram', telegramRoutes);
app.use('/api/airdrop', airdropRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/history', historyRoutes); // ✅
app.use('/api/referral', referralRoutes);
app.use('/api/wallet', walletRoutes);

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Chekhovsky Choppa DApp API',
      version: '1.0.0',
      description: 'Swagger UI for Telegram Mini App backend',
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
