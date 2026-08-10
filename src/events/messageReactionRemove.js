const config = require("../config/config.json");

module.exports = {

    name: "messageReactionRemove",

    async execute(reaction, user) {

        if (user.bot) {
            return;
        }

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

            await member.roles.remove(role);

            console.log(
                `🎮 Removed ${role.name} from ${user.tag}`
            );

        } catch (error) {

            console.error(
                `Failed to remove ${gameName} role:`,
                error
            );

        }

    }

};