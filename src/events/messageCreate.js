const userLevelService =
    require("../services/userLevelService");

const achievementService =
    require("../services/achievementService");

module.exports = {

    name: "messageCreate",

    async execute(message) {

        // Ignore bots
        if (message.author.bot) {
            return;
        }

        // Ignore DMs
        if (!message.guild) {
            return;
        }

        // Ignore commands
        if (message.content.startsWith("/")) {
            return;
        }

        // 🏆 First message achievement
        const firstWords =
            await achievementService.unlock(
                message.author.id,
                "first_words"
            );

        if (firstWords) {

            await message.channel.send({
                content:
                    `🏆 ${message.member} unlocked **${firstWords.emoji} ${firstWords.name}**!`
            });

        }

        // Existing XP system
        const result =
            await userLevelService.addXP(
                message.member
            );

        if (result?.leveledUp) {

            await message.channel.send({
                content:
                    `🎉 ${message.member} just reached **Level ${result.level}**!`
            });

            // 🏆 Level achievements
            let achievementKey = null;

            if (result.level === 5) {

                achievementKey = "rising_star";

            } else if (result.level === 10) {

                achievementKey = "veteran";

            } else if (result.level === 25) {

                achievementKey = "elite";

            }

            if (achievementKey) {

                const achievement =
                    await achievementService.unlock(
                        message.author.id,
                        achievementKey
                    );

                if (achievement) {

                    await message.channel.send({
                        content:
                            `🏆 ${message.member} unlocked **${achievement.emoji} ${achievement.name}**!`
                    });

                }

            }

        }

    }

};