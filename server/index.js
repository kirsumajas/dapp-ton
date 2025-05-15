require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.post('/check-subscription', async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
