const db = require("../database/database");

class UserRepository {

    create(user) {

        const statement = db.prepare(`
            INSERT OR IGNORE INTO users (
                id,
                username,
                display_name,
                avatar_url,
                joined_at,
                updated_at
            )
            VALUES (
                @id,
                @username,
                @display_name,
                @avatar_url,
                @joined_at,
                CURRENT_TIMESTAMP
            )
        `);

        return statement.run(user);
    }

    update(user) {

        const statement = db.prepare(`
            UPDATE users
            SET
                username = @username,
                display_name = @display_name,
                avatar_url = @avatar_url,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = @id
        `);

        return statement.run(user);
    }

    findById(id) {

        const statement = db.prepare(`
            SELECT *
            FROM users
            WHERE id = ?
        `);

        return statement.get(id);
    }

    findAll() {

        return db.prepare(`
            SELECT *
            FROM users
            ORDER BY username
        `).all();
    }

}

module.exports = new UserRepository();