const achievementRepository =
    require("../repositories/achievementRepository");

const definitions =
    require("./achievementDefinitions");

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

}

module.exports =
    new AchievementService();