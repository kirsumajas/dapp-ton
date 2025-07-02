// server/controllers/referralController.js

const db = require('../db/db');
const generateReferralCode = require('../utils/generateReferralCode');

function signup(req, res) {
  const { telegram_id, referralCode } = req.body;

  if (!telegram_id) {
    return res.status(400).json({ error: 'telegram_id is required' });
  }

  let referralCodeToAssign = generateReferralCode();

  const existingUser = db.prepare(`
    SELECT * FROM users WHERE telegram_id = ?
  `).get(telegram_id);

  if (existingUser) {
    return res.json({
      message: 'User already registered',
      referralCode: existingUser.referral_code,
      balance: existingUser.balance,
    });
  }

  db.prepare(`
    INSERT INTO users (telegram_id, referral_code)
    VALUES (?, ?)
  `).run(telegram_id, referralCodeToAssign);

  if (referralCode) {
    const referrer = db.prepare(`
      SELECT telegram_id FROM users WHERE referral_code = ?
    `).get(referralCode);

    if (referrer) {
      db.prepare(`
        INSERT INTO referrals (referrer_telegram_id, referred_telegram_id)
        VALUES (?, ?)
      `).run(referrer.telegram_id, telegram_id);

      db.prepare(`
        UPDATE users SET balance = balance + 5
        WHERE telegram_id = ?
      `).run(referrer.telegram_id);

      db.prepare(`
        UPDATE users SET balance = balance + 5
        WHERE telegram_id = ?
      `).run(telegram_id);

      return res.json({
        message: 'Signup successful via referral!',
        referralCode: referralCodeToAssign,
        rewardGiven: true,
      });
    } else {
      return res.status(400).json({ error: 'Invalid referral code' });
    }
  }

  res.json({
    message: 'Signup successful (no referral)',
    referralCode: referralCodeToAssign,
  });
}

function getUserReferral(req, res) {
  const { telegram_id } = req.params;

  const user = db.prepare(`
    SELECT referral_code, balance FROM users
    WHERE telegram_id = ?
  `).get(telegram_id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    referralLink: `https://your-telegram-mini-app.com/?ref=${user.referral_code}`,
    balance: user.balance,
  });
}
function getProgress(req, res) {
  const { telegram_id } = req.params;

  // Check if the user exists
  const user = db.prepare(`
    SELECT * FROM users
    WHERE telegram_id = ?
  `).get(telegram_id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check wallet connection
  const wallet = db.prepare(`
    SELECT * FROM user_wallets
    WHERE telegram_id = ?
  `).get(telegram_id);

  // Check task completions
  const taskCount = db.prepare(`
    SELECT COUNT(*) as count FROM task_completions
    WHERE telegram_id = ?
  `).get(telegram_id);

  // Check referral
  const referral = db.prepare(`
    SELECT * FROM referrals
    WHERE referred_telegram_id = ?
  `).get(telegram_id);

  let rewardEligible = false;

  if (referral) {
    if (wallet && taskCount.count > 0 && referral.reward_given === 0) {
      rewardEligible = true;
    }
  }

  res.json({
    hasConnectedWallet: !!wallet,
    tasksCompleted: taskCount.count,
    rewardEligible,
    needsToConnectWallet: !wallet,
    needsToCompleteTask: taskCount.count === 0,
    referralExists: !!referral,
    referralRewardGiven: referral?.reward_given === 1 || false,
  });
}

module.exports = {
  signup,
  getUserReferral,
  getProgress,
};
