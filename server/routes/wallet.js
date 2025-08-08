// server/routes/wallet.js - Enhanced with transaction support
const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const validateInitData = require('../middleware/validateInitData');
const rateLimiter = require('../middleware/rateLimiter');

// Connect a TON wallet to user account
router.post('/connect', validateInitData, rateLimiter, walletController.connect);

// Get wallet information for a user
router.get('/info/:telegram_id', validateInitData, rateLimiter, walletController.getInfo);

// Disconnect wallet from user account
router.post('/disconnect', validateInitData, rateLimiter, walletController.disconnect);

// Check if user has a connected wallet
router.get('/check/:telegram_id', validateInitData, rateLimiter, walletController.checkConnection);

module.exports = router;