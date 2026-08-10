const config =
    require("../config/config.json");
const gameRoleService =
    require("../services/gameRoleService");

module.exports = {

    name: "messageReactionAdd",

    async execute(reaction, user) {

        try {

            // Ignore bots
            if (user.bot) {
                return;
            }

            // Fetch partial reaction
            if (reaction.partial) {

                await reaction.fetch();

            }

            const message =
                reaction.message;

            // Make sure we have the message
            if (!message) {
                return;
            }

            console.log(
                `🎯 Reaction detected: ${reaction.emoji.name || reaction.emoji.id} by ${user.tag}`
            );

            console.log(
                `Message ID: ${message.id}`
            );

            console.log(
                `Configured Message ID: ${config.gameRoles.messageId}`
            );

            // Only process our game-role message
            if (
                message.id !==
                config.gameRoles.messageId
            ) {

                console.log(
                    "❌ Reaction is not from game-role panel."
                );

                return;

            }

            const emojiId =
                reaction.emoji.id;

            console.log(
                `Emoji ID: ${emojiId}`
            );

            const gameEntry =
                Object.entries(
                    config.gameRoles
                ).find(
                    ([name, game]) =>

                        name !== "messageId" &&

                        game.emojiId === emojiId
                );

            if (!gameEntry) {

                console.log(
                    "❌ Emoji not configured."
                );

                return;

            }

            const [
                gameName,
                gameConfig
            ] = gameEntry;

            console.log(
                `🎮 Game detected: ${gameName}`
            );

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
                    `❌ Role not found: ${gameConfig.roleId}`
                );

                return;

            }

            await member.roles.add(role);

            await gameRoleService.refresh(
                message.guild
            );

            console.log(
                `✅ Added @${role.name} to ${user.tag}`
            );

        } catch (error) {

            console.error(
                "❌ Game role reaction error:",
                error
            );

        }

    }

};