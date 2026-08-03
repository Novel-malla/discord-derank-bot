const userLevelService = require("../services/userLevelService");

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

        const result = await userLevelService.addXP(
            message.member
        );

        if (result?.leveledUp) {

            await message.channel.send({
                content:
                    `🎉 ${message.member} just reached **Level ${result.level}**!`
            });

        }

    }

};