const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

function createWelcomeButtons() {

    return new ActionRowBuilder().addComponents(

        new ButtonBuilder()
            .setCustomId("rules")
            .setLabel("📜 Rules")
            .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
            .setCustomId("roles")
            .setLabel("🎭 Roles")
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId("stats")
            .setLabel("📊 Stats")
            .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
            .setCustomId("creators")
            .setLabel("🎥 Creators")
            .setStyle(ButtonStyle.Secondary)
    );

}

module.exports = {
    createWelcomeButtons
};