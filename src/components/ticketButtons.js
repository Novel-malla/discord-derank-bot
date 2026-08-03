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
                .setLabel("Close")
                .setEmoji("🔒")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("ticket_delete")
                .setLabel("Delete")
                .setEmoji("🗑️")
                .setStyle(ButtonStyle.Danger)

        );

}

module.exports = {
    createTicketPanelButton,
    createTicketControls
};