const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

function createTicketPanelButton() {

    return new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
                .setCustomId("ticket_open")
                .setLabel("Open Ticket")
                .setEmoji("🎫")
                .setStyle(ButtonStyle.Primary)

        );

}

function createTicketControls() {

    return new ActionRowBuilder()
        .addComponents(

            new ButtonBuilder()
                .setCustomId("ticket_close")
                .setLabel("Resolve Ticket")
                .setEmoji("🔒")
                .setStyle(ButtonStyle.Success)

        );

}

module.exports = {
    createTicketPanelButton,
    createTicketControls
};