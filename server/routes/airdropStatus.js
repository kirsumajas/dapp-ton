const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/', (req, res) => {
  const total = parseFloat(process.env.AIRDROP_TOTAL || '100');
  const perClaim = parseFloat(process.env.AIRDROP_PER_CLAIM || '0.1');

  const maxClaims = Math.floor(total / perClaim);
  const claimed = db.prepare('SELECT COUNT(*) AS count FROM airdrop_claims').get().count;
  const remaining = Math.max(0, maxClaims - claimed);

  res.json({
    totalClaimsAllowed: maxClaims,
    alreadyClaimed: claimed,
    remainingClaims: remaining
  });
});

module.exports = router;
