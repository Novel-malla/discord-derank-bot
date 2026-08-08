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

        const supportChannel =
            interaction.guild.channels.cache.get(
                config.tickets.channelId
            );

        const starterMessage =
            await supportChannel.send({
                content: `🎫 Ticket created by ${interaction.user}`
            });

        const thread =
            await starterMessage.startThread({

                name: `Ticket • ${interaction.user.username}`,

                autoArchiveDuration: 1440

            });

        ticketRepository.create({

            user_id: interaction.user.id,

            channel_id: thread.id

        });

        await thread.send({

            content:
                `${interaction.user}

# 🎫 Support Ticket

Thanks for contacting us!

Please describe your issue.

A moderator will respond shortly.`,

            components: [
                createTicketControls()
            ]

        });

        return interaction.reply({

            ephemeral: true,

            content: `✅ Your ticket has been created: ${thread}`

        });

    }

    async close(interaction) {

        const ticket =
            ticketRepository.findByChannel(
                interaction.channel.id
            );

        if (!ticket) {

            return interaction.reply({
                ephemeral: true,
                content: "❌ This is not a ticket thread."
            });

        }

        const isModerator =
            interaction.member.roles.cache.has(
                config.tickets.moderatorRoleId
            );

        const isOwner =
            interaction.user.id === ticket.user_id;

        if (!isModerator && !isOwner) {

            return interaction.reply({
                ephemeral: true,
                content: "❌ You don't have permission to close this ticket."
            });

        }

        ticketRepository.close(ticket.id);

        await interaction.message.edit({
            components: []
        });

        await interaction.reply({
            content: "🔒 Ticket resolved. Archiving thread..."
        });

        setTimeout(async () => {

            try {

                await interaction.channel.setLocked(true);

                await interaction.channel.setArchived(true);

            } catch (error) {

                console.error(
                    "Failed to archive ticket:",
                    error
                );

            }

        }, 3000);

    }

}

module.exports = new TicketService();