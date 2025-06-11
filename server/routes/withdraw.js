const express = require('express');
const router = express.Router();
const { handleWithdraw } = require('../controllers/withdrawController');
const validateInitData = require('../middleware/validateInitData');
const rateLimiter = require('../middleware/rateLimiter');

router.post('/withdraw', validateInitData, rateLimiter, handleWithdraw);

module.exports = router;

