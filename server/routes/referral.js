// server/routes/referral.js

const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');

router.post('/signup', referralController.signup);
router.get('/me/:telegram_id', referralController.getUserReferral);
router.get('/progress/:telegram_id', referralController.getProgress);

module.exports = router;
