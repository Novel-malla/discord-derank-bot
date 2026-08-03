const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const userLevelRepository =
    require("../../repositories/userLevelRepository");

const progressBar = require("../../utils/progressBar");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("View your level"),

    async execute(interaction) {

        const level =
            userLevelRepository.findByUserId(
                interaction.user.id
            );

        if (!level) {

            return interaction.reply({
                content: "You don't have any XP yet."
            });

        }

        const requiredXP = level.level * 250;

        const progress =
            Math.floor(
                (level.xp / requiredXP) * 100
            );

        const bar = progressBar(progress);

        const embed = new EmbedBuilder()
            .setColor("Gold")
            .setTitle("🎉 Level Up!")
            .setDescription(
                `${interaction.member} reached **Level ${level.level}**`
            )
            .setThumbnail(
                interaction.user.displayAvatarURL()
            )
            .addFields(
                {
                    name: "⭐ Level",
                    value: `${level.level}`,
                    inline: true
                },
                {
                    name: "✨ XP",
                    value: `${level.xp} / ${requiredXP}`,
                    inline: true
                },
                {
                    name: "📈 Progress",
                    value: `${bar} ${progress}%`,
                    inline: true
                }
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }

};