const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const config = require("../../config/config.json");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("gameroles")
        .setDescription("Create the game role selection panel")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("🎮 What games do you play?")
            .setDescription(
                "React below to select the games you play.\n\n" +
                "You can select multiple games.\n\n" +
                "🔄 **Remove your reaction to remove the role.**"
            );

        const message =
            await interaction.channel.send({
                embeds: [embed]
            });

        for (const [name, game] of Object.entries(
            config.gameRoles
        )) {

            // Skip the message ID
            if (name === "messageId") {
                continue;
            }

            try {

                await message.react(game.emojiId);

            } catch (error) {

                console.error(
                    `Failed to add ${name} emoji:`,
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