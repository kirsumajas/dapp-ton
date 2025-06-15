import express from 'express';
const router = express.Router();

router.post('/', (req, res) => {
  const { level, message, data, userAgent } = req.body;

  // You could log to a file, a database, or just console
  console.log(`[${level.toUpperCase()}] ${message}`, data || '', '| UA:', userAgent);

  res.status(200).json({ success: true });
});

export default router;
