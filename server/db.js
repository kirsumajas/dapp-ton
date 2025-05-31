const Database = require('better-sqlite3');
const db = new Database('milestones.db');

// Create the milestones table if not exists
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