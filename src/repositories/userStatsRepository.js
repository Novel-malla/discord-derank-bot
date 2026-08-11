const db = require("../database/database");

class UserStatsRepository {

    create(userId) {

        db.prepare(`
            INSERT OR IGNORE INTO user_stats (
                user_id
            )
            VALUES (?)
        `).run(userId);

    }

    incrementMessages(userId) {

        this.create(userId);

        db.prepare(`
            UPDATE user_stats
            SET
                message_count = message_count + 1,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?
        `).run(userId);

    }

    getByUserId(userId) {

        return db.prepare(`
            SELECT *
            FROM user_stats
            WHERE user_id = ?
        `).get(userId);

    }

}

module.exports =
    new UserStatsRepository();