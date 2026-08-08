const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const {
    createTicketPanelButton
} = require("../../components/ticketButtons");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("ticketpanel")
        .setDescription("Create the support ticket panel")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const embed =
            new EmbedBuilder()
                .setColor("Blue")
                .setTitle("🎫 Support")
                .setDescription(
                    `Need help?

• 🐞 Report a bug
• ⚠️ Report a member
• ❓ Ask a question
• 💡 Suggest a feature

Click the button below to open a support ticket.

A private thread will be created for you.`
                );

        const message =
            await interaction.channel.send({

                embeds: [embed],

                components: [

                    createTicketPanelButton()

                ]

            });

        await interaction.reply({

            ephemeral: true,

            content:
                `✅ Ticket panel created.

Message ID:

${message.id}`

        });

    }

};