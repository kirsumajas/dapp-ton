const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { level, message, data, userAgent } = req.body;

  console.log(`[${level.toUpperCase()}] ${message}`, data || '', '| UA:', userAgent);

  res.status(200).json({ success: true });
});

module.exports = router;
