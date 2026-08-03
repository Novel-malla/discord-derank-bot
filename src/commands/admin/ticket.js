const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const createTicketPanelEmbed =
    require("../../embeds/ticketPanelEmbed");

const {
    createTicketPanelButton
} = require("../../components/ticketButtons");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("ticket")

        .setDescription("Ticket system")

        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageGuild
        )

        .addSubcommand(subcommand =>

            subcommand

                .setName("panel")

                .setDescription(
                    "Send the ticket panel"
                )

        ),

    async execute(interaction) {

        await interaction.reply({

            embeds: [

                createTicketPanelEmbed()

            ],

            components: [

                createTicketPanelButton()

            ]

        });

    }

};