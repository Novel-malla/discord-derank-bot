const db = require("../database/database");

class LFGMemberRepository {

    addMember(lfgId, userId) {

        db.prepare(`
            INSERT INTO lfg_members (
                lfg_id,
                user_id
            )
            VALUES (?, ?)
        `).run(lfgId, userId);

    }

    getMembers(lfgId) {

        return db.prepare(`
            SELECT *
            FROM lfg_members
            WHERE lfg_id = ?
        `).all(lfgId);

    }

    removeMember(lfgId, userId) {

        const result = db.prepare(`
            DELETE FROM lfg_members
            WHERE lfg_id = ?
            AND user_id = ?
        `).run(lfgId, userId);

        return result.changes > 0;

    }

    isMember(lfgId, userId) {

        return db.prepare(`
            SELECT 1
            FROM lfg_members
            WHERE lfg_id = ?
            AND user_id = ?
        `).get(lfgId, userId);

    }

    getMemberCount(lfgId) {

        const row = db.prepare(`
            SELECT COUNT(*) AS count
            FROM lfg_members
            WHERE lfg_id = ?
        `).get(lfgId);

        return row ? row.count : 0;

    }

    getUserJoinCount(userId) {

        return db.prepare(`
            SELECT COUNT(*) AS count
            FROM lfg_members lm
            INNER JOIN lfg_posts lp
                ON lm.lfg_id = lp.id
            WHERE lm.user_id = ?
            AND lp.host_id != ?
        `).get(userId, userId).count;

    }

}

module.exports = new LFGMemberRepository();