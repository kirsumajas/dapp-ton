const Database = require('better-sqlite3');

// Initialize database first
const db = new Database('milestones.db');

// Then run the schema setup
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

module.exports = db;
