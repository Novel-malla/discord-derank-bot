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
            ([name]) => name !== "messageId"
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

            let count = 0;

            if (role) {

                try {

                    count =
                        role.members.size;

                } catch (error) {

                    console.error(
                        `Failed to count ${name} members:`,
                        error
                    );

                }

            }

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
                    .replace(
                        /([a-z])([A-Z])/g,
                        "$1 $2"
                    )
                    .replace(
                        /^\w/,
                        c => c.toUpperCase()
                    );

            lines.push(
                `${emojiText} **${displayName}** — \`${count} players\``
            );

        }

        return lines.join("\n");

    }

    async refresh(guild) {

        const messageId =
            config.gameRoles.messageId;

        const channelId =
            config.gameRoles.channelId;

        if (!messageId || !channelId) {
            return;
        }

        try {

            const channel =
                await guild.channels.fetch(
                    channelId
                );

            if (!channel) {
                return;
            }

            const message =
                await channel.messages.fetch(
                    messageId
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

        } catch (error) {

            console.error(
                "Failed to refresh game role panel:",
                error
            );

        }

    }

}

module.exports =
    new GameRoleService();