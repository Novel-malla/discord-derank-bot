module.exports = `
CREATE TABLE IF NOT EXISTS lfg_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    message_id TEXT,
    host_id TEXT NOT NULL,
    game TEXT NOT NULL,
    rank TEXT,
    max_players INTEGER NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'OPEN',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(host_id) REFERENCES users(id)
);
`;