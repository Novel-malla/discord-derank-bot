module.exports = `
CREATE TABLE IF NOT EXISTS achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    emoji TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_achievements (
    user_id TEXT NOT NULL,
    achievement_id INTEGER NOT NULL,
    unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (
        user_id,
        achievement_id
    ),

    FOREIGN KEY(user_id)
        REFERENCES users(id),

    FOREIGN KEY(achievement_id)
        REFERENCES achievements(id)
);
`;