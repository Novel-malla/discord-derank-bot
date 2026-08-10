const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const config = require("../../config/config.json");

function getGameEntries() {
    return Object.entries(config.gameRoles)
        .filter(([name]) => name !== "messageId");
}

function buildDescription(guild) {

    const lines = [
        "Select the games you play by reacting below.",
        "",
        "You can select multiple games.",
        "Remove your reaction to remove the role.",
        ""
    ];

    for (const [name, game] of getGameEntries()) {

        const role =
            guild.roles.cache.get(game.roleId);

        const count =
            role ? role.members.size : 0;

        const emoji =
            guild.emojis.cache.get(game.emojiId);

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

module.exports = {

    data: new SlashCommandBuilder()
        .setName("gameroles")
        .setDescription("Create the game role selection panel")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const embed =
            new EmbedBuilder()
                .setColor("Blue")
                .setTitle("🎮 What games do you play?")
                .setDescription(
                    buildDescription(interaction.guild)
                )
                .setFooter({
                    text: "Game roles can be changed at any time."
                });

        const message =
            await interaction.channel.send({
                embeds: [embed]
            });

        console.log(
            `🎮 Game role panel message ID: ${message.id}`
        );

        console.log(
            `🎮 Game role panel channel ID: ${interaction.channel.id}`
        );

        for (const [name, game] of getGameEntries()) {

            try {

                await message.react(game.emojiId);

            } catch (error) {

                console.error(
                    `Failed to add ${name} reaction:`,
                    error
                );

            }

        }

        await interaction.reply({
            content: "✅ Game role panel created.",
            ephemeral: true
        });

    }

};