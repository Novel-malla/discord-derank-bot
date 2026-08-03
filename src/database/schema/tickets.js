module.exports = `
CREATE TABLE IF NOT EXISTS tickets (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user_id TEXT NOT NULL,

    channel_id TEXT UNIQUE,

    status TEXT NOT NULL DEFAULT 'OPEN',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    closed_at DATETIME,

    FOREIGN KEY(user_id) REFERENCES users(id)

);
`;