const express = require('express');
const router = express.Router();
const { verifyAndRewardTask } = require('../controllers/taskController');

router.post('/verify', verifyAndRewardTask); // POST /api/tasks/verify

module.exports = router;
