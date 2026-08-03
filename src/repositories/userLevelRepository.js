const db = require("../database/database");

class UserLevelRepository {

    create(userId) {

        db.prepare(`
            INSERT OR IGNORE INTO user_levels (
                user_id
            )
            VALUES (?)
        `).run(userId);

    }

    findByUserId(userId) {

        return db.prepare(`
            SELECT *
            FROM user_levels
            WHERE user_id = ?
        `).get(userId);

    }

    update(level) {

        db.prepare(`
            UPDATE user_levels
            SET
                xp = @xp,
                level = @level,
                last_xp_at = @last_xp_at
            WHERE user_id = @user_id
        `).run(level);

    }

    getLeaderboard(limit = 10) {

        return db.prepare(`
            SELECT
                u.display_name,
                ul.level,
                ul.xp
            FROM user_levels ul
            INNER JOIN users u
                ON ul.user_id = u.id
            ORDER BY
                ul.level DESC,
                ul.xp DESC
            LIMIT ?
        `).all(limit);

    }

}

module.exports = new UserLevelRepository();