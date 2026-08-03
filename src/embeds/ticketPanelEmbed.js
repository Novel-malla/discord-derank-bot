const { EmbedBuilder } = require("discord.js");

function createTicketPanelEmbed() {

    return new EmbedBuilder()
        .setColor("Blue")
        .setTitle("🎫 Support Center")
        .setDescription(
            [
                "Need help?",
                "",
                "Press **Open Ticket** below.",
                "",
                "A private support channel will be created."
            ].join("\n")
        );

}

module.exports = createTicketPanelEmbed;