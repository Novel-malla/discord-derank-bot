const db = require("../database/database");

class LFGRepository {

    create(lfg) {

        const statement = db.prepare(`
            INSERT INTO lfg_posts (
                guild_id,
                channel_id,
                host_id,
                game,
                rank,
                max_players,
                description,
                last_activity_at
            )
            VALUES (
                @guild_id,
                @channel_id,
                @host_id,
                @game,
                @rank,
                @max_players,
                @description,
                CURRENT_TIMESTAMP
            )
        `);

        const result = statement.run(lfg);

        return result.lastInsertRowid;
    }

    updateMessageId(id, messageId) {

        db.prepare(`
            UPDATE lfg_posts
            SET message_id = ?
            WHERE id = ?
        `).run(messageId, id);

    }

    updateStatus(id, status) {

        db.prepare(`
            UPDATE lfg_posts
            SET status = ?
            WHERE id = ?
        `).run(status, id);

    }

    findById(id) {

        return db.prepare(`
            SELECT *
            FROM lfg_posts
            WHERE id = ?
        `).get(id);

    }

    findByMessageId(messageId) {

        return db.prepare(`
            SELECT *
            FROM lfg_posts
            WHERE message_id = ?
        `).get(messageId);

    }

    delete(id) {

        db.prepare(`
            DELETE FROM lfg_posts
            WHERE id = ?
        `).run(id);

    }

    findExpired(expireAfterMinutes) {

        return db.prepare(`
            SELECT *
            FROM lfg_posts
            WHERE status != 'CLOSED'
            AND datetime(created_at)
                <= datetime('now', '-' || ? || ' minutes')
        `).all(expireAfterMinutes);

    }

    findActive() {

        return db.prepare(`
            SELECT *
            FROM lfg_posts
            WHERE status != 'CLOSED'
            ORDER BY created_at DESC
        `).all();

    }

    updateGroupChannelId(id, groupChannelId) {

        db.prepare(`
            UPDATE lfg_posts
            SET group_channel_id = ?
            WHERE id = ?
        `).run(
            groupChannelId,
            id
        );

    }

    updateActivity(id) {

        db.prepare(`
            UPDATE lfg_posts
            SET last_activity_at = CURRENT_TIMESTAMP
            WHERE id = ?
            AND status = 'OPEN'
        `).run(id);

    }

    findInactive(hours = 2) {

        return db.prepare(`
            SELECT *
            FROM lfg_posts
            WHERE status = 'OPEN'
            AND last_activity_at IS NOT NULL
            AND last_activity_at <= datetime('now', ?)
        `).all(`-${hours} hours`);

    }

}

module.exports = new LFGRepository();