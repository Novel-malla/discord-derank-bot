const {
    EmbedBuilder
} = require("discord.js");

const config =
    require("../config/config.json");

class GameRoleService {

    getGameEntries() {

        return Object.entries(
            config.gameRoles
        ).filter(
            ([name]) =>
                name !== "messageId" &&
                name !== "channelId"
        );

    }

    buildDescription(guild) {

        const lines = [
            "Select the games you play by reacting below.",
            "",
            "You can select multiple games.",
            "Remove your reaction to remove the role.",
            ""
        ];

        for (const [name, game] of this.getGameEntries()) {

            const role =
                guild.roles.cache.get(
                    game.roleId
                );

            const count =
                role
                    ? role.members.size
                    : 0;

            const emoji =
                guild.emojis.cache.get(
                    game.emojiId
                );

            const emojiText =
                emoji
                    ? `${emoji}`
                    : `<:game:${game.emojiId}>`;

            const displayName =
                name
                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                    .replace(/^\w/, c => c.toUpperCase());

            lines.push(
                `${emojiText} **${displayName}** — \`${count} players\``
            );

        }

        return lines.join("\n");

    }

    async refresh(guild) {

        console.log("🔄 Refreshing game role panel...");

        const messageId =
            config.gameRoles.messageId;

        const channelId =
            config.gameRoles.channelId;

        console.log(
            `Message ID: ${messageId}`
        );

        console.log(
            `Channel ID: ${channelId}`
        );

        if (!messageId || !channelId) {

            console.error(
                "❌ Game role panel messageId or channelId is missing."
            );

            return;

        }

        try {

            const channel =
                await guild.channels.fetch(
                    channelId
                );

            if (!channel) {

                console.error(
                    "❌ Game role panel channel not found."
                );

                return;

            }

            console.log(
                `✅ Found channel: ${channel.name}`
            );

            const message =
                await channel.messages.fetch(
                    messageId
                );

            if (!message) {

                console.error(
                    "❌ Game role panel message not found."
                );

                return;

            }

            console.log(
                "✅ Found game role panel message."
            );

            const embed =
                new EmbedBuilder()
                    .setColor("Blue")
                    .setTitle(
                        "🎮 What games do you play?"
                    )
                    .setDescription(
                        this.buildDescription(guild)
                    )
                    .setFooter({
                        text:
                            "Game roles can be changed at any time."
                    });

            await message.edit({
                embeds: [embed]
            });

            console.log(
                "✅ Game role panel updated."
            );

        } catch (error) {

            console.error(
                "❌ Failed to refresh game role panel:",
                error
            );

        }

    }

}

module.exports =
    new GameRoleService();