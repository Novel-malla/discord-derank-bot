const userLevelRepository = require("../repositories/userLevelRepository");
const userService = require("./userService");

class UserLevelService {

    async addXP(member) {

        // Ensure user exists
        await userService.syncMember(member);

        // Ensure level row exists
        userLevelRepository.create(member.id);

        const level =
            userLevelRepository.findByUserId(member.id);

        // 30-second cooldown
        if (level.last_xp_at) {

            const lastXP =
                new Date(level.last_xp_at);

            if (Date.now() - lastXP.getTime() < 60000) {
                return;
            }

        }

        const gainedXP =
            Math.floor(Math.random() * 11) + 10;

        level.xp += gainedXP;

        const requiredXP =
            level.level * 250;

        let leveledUp = false;

        if (level.xp >= requiredXP) {

            level.level++;
            level.xp = level.xp - requiredXP;

            leveledUp = true;

        }

        level.last_xp_at = new Date().toISOString();

        userLevelRepository.update(level);

        if (leveledUp) {

            return {
                leveledUp: true,
                level: level.level
            };

        }

        return {
            leveledUp: false
        };

    }

}

module.exports = new UserLevelService();