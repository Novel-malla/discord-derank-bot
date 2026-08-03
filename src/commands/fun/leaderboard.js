const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const userLevelRepository =
    require("../../repositories/userLevelRepository");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("View the XP leaderboard"),

    async execute(interaction) {

        const leaderboard =
            userLevelRepository.getLeaderboard();

        if (!leaderboard.length) {

            return interaction.reply({
                content: "No XP data found."
            });

        }

        const medals = [
            "🥇",
            "🥈",
            "🥉"
        ];

        const description = leaderboard
            .map((user, index) => {

                const medal =
                    medals[index] ??
                    `**${index + 1}.**`;

                return `${medal} ${user.display_name} • Level ${user.level} • ${user.xp} XP`;

            })
            .join("\n");

        const embed = new EmbedBuilder()
            .setColor("Gold")
            .setTitle("🏆 XP Leaderboard")
            .setDescription(description)
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }

};