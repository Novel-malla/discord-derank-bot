module.exports = `
CREATE TABLE IF NOT EXISTS user_levels (

    user_id TEXT PRIMARY KEY,

    xp INTEGER NOT NULL DEFAULT 0,

    level INTEGER NOT NULL DEFAULT 1,

    last_xp_at DATETIME,

    FOREIGN KEY(user_id) REFERENCES users(id)

);
`;