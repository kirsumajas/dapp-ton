const db = require('../db/db');


const tasks = [
  {
    name: 'subscribe-channel',
    title: 'Subscribe to the Telegram Channel',
    description: 'Join our main Telegram channel to stay updated.',
    reward: 0.1,
  },
  {
    name: 'follow-x',
    title: 'Follow on X (Twitter)',
    description: 'Follow our official X account to get updates.',
    reward: 0.1,
  },
];

for (const task of tasks) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO tasks (name, title, description, reward)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(task.name, task.title, task.description, task.reward);
}

console.log('✅ Tasks seeded');
