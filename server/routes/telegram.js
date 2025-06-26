const express = require('express');
const router = express.Router();
const { isUserSubscribed } = require('../controllers/telegramController');

router.post('/verify', async (req, res) => {
  const { telegramId } = req.body;

  if (!telegramId) {
    return res.status(400).json({ success: false, message: 'Missing telegramId' });
  }

  const subscribed = await isUserSubscribed(telegramId);
  if (subscribed) {
    return res.json({ success: true, message: 'User is subscribed' });
  } else {
    return res.status(403).json({ success: false, message: 'User is not subscribed' });
  }
});

module.exports = router;
