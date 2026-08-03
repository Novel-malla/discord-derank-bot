module.exports = `
CREATE TABLE IF NOT EXISTS lfg_members (
    lfg_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (lfg_id, user_id),

    FOREIGN KEY(lfg_id) REFERENCES lfg_posts(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
`;