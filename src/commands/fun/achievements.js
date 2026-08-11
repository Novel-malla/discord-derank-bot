const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const achievementService =
    require("../../services/achievementService");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("achievements")
        .setDescription(
            "View your achievements"
        ),

    async execute(interaction) {

        const newlyUnlocked = [
            ...await achievementService
                .checkLevelAchievements(
                    interaction.user.id
                ),

            ...await achievementService
                .checkMessageAchievements(
                    interaction.user.id
                )
        ];

        const achievements =
            achievementService
                .getUserAchievements(
                    interaction.user.id
                );

        const unlocked =
            achievements.filter(
                achievement =>
                    achievement.unlocked_at
            );

        const lines =
            achievements.map(
                achievement => {

                    if (achievement.unlocked_at) {

                        return (
                            `✅ ${achievement.emoji} **${achievement.name}**\n` +
                            `> ${achievement.description}`
                        );

                    }

                    return (
                        `🔒 ${achievement.emoji} **${achievement.name}**\n` +
                        `> ${achievement.description}`
                    );

                }
            );

        const embed =
            new EmbedBuilder()
                .setColor("Gold")
                .setTitle(
                    `🏆 ${interaction.user.displayName}'s Achievements`
                )
                .setDescription(
                    lines.join("\n\n")
                )
                .setFooter({
                    text:
                        `${unlocked.length} / ${achievements.length} unlocked`
                })
                .setThumbnail(
                    interaction.user.displayAvatarURL()
                );

        if (newlyUnlocked.length > 0) {

            embed.addFields({
                name: "🎉 Newly Unlocked!",
                value:
                    newlyUnlocked
                        .map(
                            achievement =>
                                `${achievement.emoji} **${achievement.name}**`
                        )
                        .join("\n")
            });

        }

        await interaction.reply({
            embeds: [embed]
        });

    }

};