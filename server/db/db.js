// db.js
const Database = require('better-sqlite3');
const db = new Database('milestones.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS milestones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    season TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK(status IN ('in_progress', 'completed', 'failed')) DEFAULT 'in_progress',
    deadline TEXT
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    telegram_id TEXT PRIMARY KEY,
    balance INTEGER DEFAULT 0
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS withdrawals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id TEXT NOT NULL,
    wallet_address TEXT NOT NULL,
    amount REAL NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS airdrop_claims (
    telegram_id TEXT PRIMARY KEY,
    wallet_address TEXT UNIQUE,
    claimed_at TEXT
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS task_completions (
    telegram_id TEXT NOT NULL,
    task_name TEXT NOT NULL,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (telegram_id, task_name)
  );
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS user_wallets (
    telegram_id TEXT PRIMARY KEY,
    wallet_address TEXT UNIQUE
  );
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS user_rewards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id TEXT NOT NULL,
    amount REAL NOT NULL,
    reward_type TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (telegram_id) REFERENCES users(telegram_id)
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    name TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    reward REAL NOT NULL
  );
`);


module.exports = db;
