module.exports = `
CREATE TABLE IF NOT EXISTS user_stats (
    user_id TEXT PRIMARY KEY,

    message_count INTEGER DEFAULT 0,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
        REFERENCES users(id)
);
`;