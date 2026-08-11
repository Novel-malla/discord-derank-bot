const userLevelRepository =
    require("../repositories/userLevelRepository");

const userStatsRepository =
    require("../repositories/userStatsRepository");

const lfgRepository =
    require("../repositories/lfgRepository");

const achievementRepository =
    require("../repositories/achievementRepository");

class StatsService {

    getUserStats(userId) {

        const level =
            userLevelRepository.findByUserId(
                userId
            );

        const stats =
            userStatsRepository.getByUserId(
                userId
            );

        const lfgCreated =
            lfgRepository.getUserCreatedCount(
                userId
            );

        const lfgJoined =
            lfgRepository.getUserJoinedCount(
                userId
            );

        const achievements =
            achievementRepository.getUnlockedCount(
                userId
            );

        const totalAchievements =
            achievementRepository.findAll().length;

        return {

            level: level?.level || 1,

            xp: level?.xp || 0,

            messages:
                stats?.message_count || 0,

            lfgCreated,

            lfgJoined,

            achievements,

            totalAchievements

        };

    }

}

module.exports =
    new StatsService();