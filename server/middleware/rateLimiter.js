const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // Max 3 withdraws per IP per minute
  message: { error: 'Too many requests, please try again later.' }
});
