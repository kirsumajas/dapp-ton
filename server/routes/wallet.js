const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const db = require('../db/db'); // ✅ ← THIS LINE ADDED
router.post('/connect', walletController.connectWallet);

router.get('/all', (req, res) => {
  const wallets = db.prepare(`
    SELECT * FROM user_wallets
  `).all();

  res.json(wallets);
});

module.exports = router;
