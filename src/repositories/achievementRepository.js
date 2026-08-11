const db = require("../database/database");

class AchievementRepository {

    create(achievement) {

        return db.prepare(`
            INSERT OR IGNORE INTO achievements (
                key,
                name,
                description,
                emoji
            )
            VALUES (
                @key,
                @name,
                @description,
                @emoji
            )
        `).run(achievement);

    }

    findByKey(key) {

        return db.prepare(`
            SELECT *
            FROM achievements
            WHERE key = ?
        `).get(key);

    }

    findAll() {

        return db.prepare(`
            SELECT *
            FROM achievements
            ORDER BY id
        `).all();

    }

    unlock(userId, achievementId) {

        return db.prepare(`
            INSERT OR IGNORE INTO user_achievements (
                user_id,
                achievement_id
            )
            VALUES (?, ?)
        `).run(
            userId,
            achievementId
        );

    }

    isUnlocked(userId, achievementId) {

        return db.prepare(`
            SELECT 1
            FROM user_achievements
            WHERE user_id = ?
            AND achievement_id = ?
        `).get(
            userId,
            achievementId
        );

    }

    findUserAchievements(userId) {

        return db.prepare(`
            SELECT
                a.*,
                ua.unlocked_at
            FROM achievements a
            LEFT JOIN user_achievements ua
                ON a.id = ua.achievement_id
                AND ua.user_id = ?
            ORDER BY a.id
        `).all(userId);

    }

    getUnlockedCount(userId) {

        return db.prepare(`
            SELECT COUNT(*) AS count
            FROM user_achievements
            WHERE user_id = ?
        `).get(userId).count;

    }

}

module.exports =
    new AchievementRepository();