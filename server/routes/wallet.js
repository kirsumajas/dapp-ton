const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

router.post('/connect', walletController.connectWallet);

router.get('/all', (req, res) => {
  const wallets = db.prepare(`
    SELECT * FROM user_wallets
  `).all();

  res.json(wallets);
});

module.exports = router;
