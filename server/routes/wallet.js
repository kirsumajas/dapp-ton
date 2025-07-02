const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

router.post('/connect', walletController.connectWallet);

module.exports = router;
