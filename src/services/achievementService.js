const achievementRepository =
    require("../repositories/achievementRepository");

const userLevelRepository =
    require("../repositories/userLevelRepository");

const definitions =
    require("./achievementDefinitions");

const userStatsRepository =
    require("../repositories/userStatsRepository");

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

}

module.exports =
    new AchievementService();