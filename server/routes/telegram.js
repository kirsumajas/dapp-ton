const express = require('express');
const router = express.Router();
const axios = require('axios');

// POST /api/telegram/check-subscription
router.post('/check-subscription', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    const response = await axios.get(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatMember`,
      {
        params: {
          chat_id: process.env.CHANNEL_USERNAME,
          user_id: userId,
        },
      }
    );

    const isMember = response.data.result.status !== 'left';
    res.json({ subscribed: isMember });
  } catch (error) {
    console.error('Error checking subscription:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to check subscription' });
  }
});

module.exports = router;
