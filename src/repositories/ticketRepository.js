const db = require("../database/database");

class TicketRepository {

    create(ticket) {

        const result = db.prepare(`
            INSERT INTO tickets (
                user_id,
                channel_id
            )
            VALUES (?, ?)
        `).run(
            ticket.user_id,
            ticket.channel_id
        );

        return result.lastInsertRowid;

    }

    findOpenTicket(userId) {

        return db.prepare(`
            SELECT *
            FROM tickets
            WHERE user_id = ?
            AND status = 'OPEN'
        `).get(userId);

    }

    findByChannel(channelId) {

        return db.prepare(`
            SELECT *
            FROM tickets
            WHERE channel_id = ?
        `).get(channelId);

    }

    updateChannel(id, channelId) {

        db.prepare(`
            UPDATE tickets
            SET channel_id = ?
            WHERE id = ?
        `).run(
            channelId,
            id
        );

    }

    close(id) {

        db.prepare(`
            UPDATE tickets
            SET
                status = 'CLOSED',
                closed_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(id);

    }

    delete(id) {

        db.prepare(`
            DELETE
            FROM tickets
            WHERE id = ?
        `).run(id);

    }

}

module.exports = new TicketRepository();