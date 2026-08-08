const config = require("../config/config.json");
const { EmbedBuilder } = require("discord.js");
const { createRoleSelectMenu } = require("../components/roleSelectMenu");
const lfgService = require("../services/lfgService");
const ticketService = require("../services/ticketService");

async function buttonHandler(interaction) {

    if (interaction.customId === "ticket_open") {
        return ticketService.open(interaction);
    }

    if (interaction.customId === "ticket_close") {
        return ticketService.close(interaction);
    }

    if (interaction.customId.startsWith("lfg_join:")) {
        return lfgService.join(interaction);
    }

    if (interaction.customId.startsWith("lfg_leave:")) {
        return lfgService.leave(interaction);
    }

    if (interaction.customId.startsWith("lfg_close:")) {
        return lfgService.close(interaction);
    }

    switch (interaction.customId) {

        case "rules":

            return interaction.reply({
                content: `📜 Please read <#${config.channels.rules}> before chatting.`,
                ephemeral: true
            });

        case "roles":

            return interaction.reply({
                content: "Select the game roles you'd like to have:",
                components: [createRoleSelectMenu(interaction.member)],
                ephemeral: true
            });

        case "stats": {

            const guild = interaction.guild;

            const statsEmbed = new EmbedBuilder()
                .setColor("#5865F2")
                .setTitle("📊 Server Statistics")
                .addFields(
                    {
                        name: "👥 Members",
                        value: `${guild.memberCount}`,
                        inline: true
                    },
                    {
                        name: "💬 Channels",
                        value: `${guild.channels.cache.size}`,
                        inline: true
                    },
                    {
                        name: "🎭 Roles",
                        value: `${guild.roles.cache.size}`,
                        inline: true
                    }
                )
                .setTimestamp();

            return interaction.reply({
                embeds: [statsEmbed],
                ephemeral: true
            });
        }

        case "creators": {

            const creators = config.streamers
                .map(s => `🎥 ${s.name}`)
                .join("\n");

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#5865F2")
                        .setTitle("🎥 Featured Creators")
                        .setDescription(creators || "No creators configured.")
                ],
                ephemeral: true
            });
        }

    }

}

module.exports = buttonHandler;