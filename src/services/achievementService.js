const achievementRepository =
    require("../repositories/achievementRepository");

const userLevelRepository =
    require("../repositories/userLevelRepository");

const definitions =
    require("./achievementDefinitions");

const userStatsRepository =
    require("../repositories/userStatsRepository");

const lfgMemberRepository =
    require("../repositories/lfgMemberRepository");

class AchievementService {

    initialize() {

        for (const achievement of definitions) {

            achievementRepository.create(
                achievement
            );

        }

        console.log(
            `🏆 Loaded ${definitions.length} achievements.`
        );

    }

    async unlock(userId, key) {

        const achievement =
            achievementRepository.findByKey(key);

        if (!achievement) {

            console.error(
                `Achievement not found: ${key}`
            );

            return null;

        }

        const alreadyUnlocked =
            achievementRepository.isUnlocked(
                userId,
                achievement.id
            );

        if (alreadyUnlocked) {
            return null;
        }

        achievementRepository.unlock(
            userId,
            achievement.id
        );

        console.log(
            `🏆 ${userId} unlocked "${achievement.name}"`
        );

        return achievement;

    }

    getUserAchievements(userId) {

        return achievementRepository
            .findUserAchievements(userId);

    }

    getUnlockedCount(userId) {

        return achievementRepository
            .getUnlockedCount(userId);

    }

    async checkLevelAchievements(userId) {

        const level =
            userLevelRepository.findByUserId(
                userId
            );

        if (!level) {
            return [];
        }

        const achievements = [];

        if (level.level >= 5) {

            const achievement =
                await this.unlock(
                    userId,
                    "rising_star"
                );

            if (achievement) {
                achievements.push(achievement);
            }

        }

        if (level.level >= 10) {

            const achievement =
                await this.unlock(
                    userId,
                    "veteran"
                );

            if (achievement) {
                achievements.push(achievement);
            }

        }

        if (level.level >= 25) {

            const achievement =
                await this.unlock(
                    userId,
                    "elite"
                );

            if (achievement) {
                achievements.push(achievement);
            }

        }

        return achievements;

    }

    async checkMessageAchievements(userId) {

        const stats =
            userStatsRepository.getByUserId(
                userId
            );

        if (!stats) {
            return [];
        }

        const achievements = [];

        if (stats.message_count >= 100) {

            const achievement =
                await this.unlock(
                    userId,
                    "chatterbox"
                );

            if (achievement) {
                achievements.push(achievement);
            }

        }

        if (stats.message_count >= 500) {

            const achievement =
                await this.unlock(
                    userId,
                    "social_butterfly"
                );

            if (achievement) {
                achievements.push(achievement);
            }

        }

        if (stats.message_count >= 1000) {

            const achievement =
                await this.unlock(
                    userId,
                    "community_pillar"
                );

            if (achievement) {
                achievements.push(achievement);
            }

        }

        return achievements;

    }

    getProgress(userId, achievementKey) {

        const level =
            userLevelRepository.findByUserId(
                userId
            );

        const stats =
            userStatsRepository.getByUserId(
                userId
            );

        switch (achievementKey) {

            case "first_words":

                return {
                    current: stats?.message_count || 0,
                    required: 1
                };

            case "rising_star":

                return {
                    current: level?.level || 0,
                    required: 5
                };

            case "veteran":

                return {
                    current: level?.level || 0,
                    required: 10
                };

            case "elite":

                return {
                    current: level?.level || 0,
                    required: 25
                };

            case "chatterbox":

                return {
                    current: stats?.message_count || 0,
                    required: 100
                };

            case "social_butterfly":

                return {
                    current: stats?.message_count || 0,
                    required: 500
                };

            case "community_pillar":

                return {
                    current: stats?.message_count || 0,
                    required: 1000
                };

            case "team_player":

                return {
                    current:
                        lfgMemberRepository.getUserJoinCount(
                            userId
                        ),
                    required: 10
                };

            default:

                return null;

        }

    }

}

module.exports =
    new AchievementService();