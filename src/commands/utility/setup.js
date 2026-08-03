const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const {
    updateDashboard
} = require("../../services/dashboardService");

const userService = require("../../services/userService");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Creates the welcome dashboard")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        await userService.syncMember(interaction.member);

        await updateDashboard(
            interaction.client,
            interaction.channel
        );

        await interaction.reply({
            content: "✅ Welcome dashboard created!",
            ephemeral: true
        });
    }
};