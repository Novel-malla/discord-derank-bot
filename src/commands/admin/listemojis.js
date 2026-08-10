const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("listemojis")
        .setDescription("List all server custom emojis")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const emojis =
            interaction.guild.emojis.cache;

        if (!emojis.size) {

            return interaction.reply({
                content: "❌ No custom emojis found.",
                ephemeral: true
            });

        }

        const lines = [];

        for (const emoji of emojis.values()) {

            lines.push(
                `${emoji} **${emoji.name}** — \`${emoji.id}\``
            );

        }

        await interaction.reply({
            content:
                `## 🎮 Server Emojis\n\n${lines.join("\n")}`,
            ephemeral: true
        });

    }

};