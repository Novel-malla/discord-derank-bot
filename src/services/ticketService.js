const {
    ChannelType,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const config = require("../config/config.json");

const ticketRepository = require("../repositories/ticketRepository");
const userService = require("./userService");

const {
    createTicketControls
} = require("../components/ticketButtons");

class TicketService {

    async open(interaction) {

        const existing =
            ticketRepository.findOpenTicket(
                interaction.user.id
            );

        if (existing) {

            return interaction.reply({
                ephemeral: true,
                content: "❌ You already have an open ticket."
            });

        }

        await userService.syncMember(
            interaction.member
        );

        const channel =
            await interaction.guild.channels.create({

                name: `ticket-${interaction.user.username}`,

                type: ChannelType.GuildText,

                parent: config.tickets.categoryId,

                permissionOverwrites: [

                    {
                        id: interaction.guild.roles.everyone.id,
                        deny: [
                            PermissionFlagsBits.ViewChannel
                        ]
                    },

                    {
                        id: interaction.user.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory
                        ]
                    },

                    {
                        id: config.tickets.moderatorRoleId,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory
                        ]
                    },

                    {
                        id: interaction.client.user.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ManageChannels
                        ]
                    }

                ]

            });

        ticketRepository.create({

            user_id: interaction.user.id,

            channel_id: channel.id

        });

        const embed =
            new EmbedBuilder()
                .setColor("Green")
                .setTitle("🎫 Support Ticket")
                .setDescription(
                    `Welcome ${interaction.user}!\n\nA moderator will assist you shortly.`
                );

        await channel.send({

            embeds: [embed],

            components: [

                createTicketControls()

            ]

        });

        return interaction.reply({

            ephemeral: true,

            content: `✅ Your ticket has been created: ${channel}`

        });

    }

    async close(interaction) {

        const ticket =
            ticketRepository.findByChannel(
                interaction.channel.id
            );

        if (interaction.user.id !== ticket.user_id && !interaction.member.roles.cache.has(config.tickets.moderatorRoleId)) {
            return interaction.reply({
                ephemeral: true,
                content: "❌ You don't have permission to close this ticket."
            });
        }

        if (!ticket) {

            return interaction.reply({
                ephemeral: true,
                content: "❌ This is not a ticket channel."
            });

        }

        ticketRepository.close(ticket.id);

        await interaction.channel.setName(
            `closed-${interaction.channel.name.replace("ticket-", "")}`
        );

        await interaction.message.edit({
            components: []
        });

        await interaction.reply({
            content: "🔒 Ticket closed. A moderator can now delete it."
        });

    }

    async delete(interaction) {

        const ticket =
            ticketRepository.findByChannel(
                interaction.channel.id
            );

        if (interaction.user.id !== ticket.user_id && !interaction.member.roles.cache.has(config.tickets.moderatorRoleId)) {
            return interaction.reply({
                ephemeral: true,
                content: "❌ You don't have permission to close this ticket."
            });
        }

        if (!ticket) {

            return interaction.reply({
                ephemeral: true,
                content: "❌ This is not a ticket channel."
            });

        }

        ticketRepository.delete(ticket.id);

        await interaction.reply({
            content: "🗑️ Ticket will be deleted in 30 seconds..."
        });

        setTimeout(async () => {
            await interaction.channel.delete();
        }, 30000);

    }

}

module.exports = new TicketService();