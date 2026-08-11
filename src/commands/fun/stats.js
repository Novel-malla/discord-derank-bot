const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const statsService =
    require("../../services/statsService");

const userLevelRepository =
    require("../../repositories/userLevelRepository");

const achievementService =
    require("../../services/achievementService");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription(
            "View your server statistics"
        ),

    async execute(interaction) {

        // Make sure achievements based on
        // current stats are evaluated first
        await achievementService
            .checkLevelAchievements(
                interaction.user.id
            );

        await achievementService
            .checkMessageAchievements(
                interaction.user.id
            );

        const stats =
            statsService.getUserStats(
                interaction.user.id
            );

        const requiredXP =
            stats.level * 250;

        const progress =
            Math.min(
                100,
                Math.floor(
                    (stats.xp / requiredXP) * 100
                )
            );

        const progressBlocks =
            Math.floor(
                progress / 10
            );

        const progressBar =
            "█".repeat(progressBlocks) +
            "░".repeat(10 - progressBlocks);

        const embed =
            new EmbedBuilder()
                .setColor("Gold")
                .setTitle(
                    `📊 ${interaction.user.displayName}'s Stats`
                )
                .setThumbnail(
                    interaction.user.displayAvatarURL()
                )
                .addFields(

                    {
                        name: "⭐ Level",
                        value:
                            `**${stats.level}**`,
                        inline: true
                    },

                    {
                        name: "✨ XP",
                        value:
                            `${stats.xp} / ${requiredXP}`,
                        inline: true
                    },

                    {
                        name: "📈 Progress",
                        value:
                            `${progressBar} ${progress}%`,
                        inline: true
                    },

                    {
                        name: "💬 Messages",
                        value:
                            `${stats.messages}`,
                        inline: true
                    },

                    {
                        name: "🎮 LFGs Created",
                        value:
                            `${stats.lfgCreated}`,
                        inline: true
                    },

                    {
                        name: "🤝 LFGs Joined",
                        value:
                            `${stats.lfgJoined}`,
                        inline: true
                    },

                    {
                        name: "🏆 Achievements",
                        value:
                            `${stats.achievements} / 9`,
                        inline: true
                    }

                )
                .setFooter({
                    text:
                        "Keep playing and participating to unlock more achievements!"
                })
                .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }

};