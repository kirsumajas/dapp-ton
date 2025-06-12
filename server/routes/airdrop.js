// routes/airdrop.js
const express = require('express');
const router = express.Router();
const { handleAirdropClaim } = require('../controllers/airdropController');
const validateInitData = require('../middleware/validateInitData');
const rateLimiter = require('../middleware/rateLimiter');

router.post('/claim', rateLimiter, handleAirdropClaim);

module.exports = router;

// validateInitData.js