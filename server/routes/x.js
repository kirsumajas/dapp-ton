const express = require('express');
const router = express.Router();
const { verifyFollowAndReward } = require('../controllers/xController');

router.post('/verify-follow', verifyFollowAndReward);

module.exports = router;