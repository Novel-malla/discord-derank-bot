const config = require("../config/config.json");

module.exports = {

    name: "messageReactionAdd",

    async execute(reaction, user) {

        // Ignore bots
        if (user.bot) {
            return;
        }

        // Fetch partial reactions
        if (reaction.partial) {

            try {

                await reaction.fetch();

            } catch (error) {

                console.error(
                    "Failed to fetch reaction:",
                    error
                );

                return;
            }

        }

        const message = reaction.message;

        // Only process our game-role message
        if (
            !config.gameRoles.messageId ||
            message.id !== config.gameRoles.messageId
        ) {
            return;
        }

        const emojiId = reaction.emoji.id;

        const gameEntry =
            Object.entries(config.gameRoles)
                .find(([name, game]) =>
                    name !== "messageId" &&
                    game.emojiId === emojiId
                );

        if (!gameEntry) {
            return;
        }

        const [gameName, gameConfig] = gameEntry;

        try {

            const member =
                await message.guild.members.fetch(
                    user.id
                );

            const role =
                message.guild.roles.cache.get(
                    gameConfig.roleId
                );

            if (!role) {

                console.error(
                    `Role not found for ${gameName}: ${gameConfig.roleId}`
                );

                return;
            }

            await member.roles.add(role);

            console.log(
                `🎮 Added ${role.name} to ${user.tag}`
            );

        } catch (error) {

            console.error(
                `Failed to add ${gameName} role:`,
                error
            );

        }

    }

};