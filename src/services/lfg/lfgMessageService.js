const config = require("../../config/config.json");

const createLFGEmbed = require("../../embeds/lfgEmbed");
const createLFGButtons = require("../../components/lfgButtons");

class LFGMessageService {

    async post(interaction, lfg) {

        const channel = interaction.guild.channels.cache.get(
            config.channels.lfg
        );

        if (!channel) {
            throw new Error("LFG channel not found.");
        }

        return channel.send({
            embeds: [
                createLFGEmbed(lfg)
            ],
            components: [
                createLFGButtons(lfg.id)
            ]
        });

    }

    async update(message, lfg) {

        await message.edit({
            embeds: [
                createLFGEmbed(lfg)
            ],
            components: [
                createLFGButtons(lfg.id)
            ]
        });

    }

}

module.exports = new LFGMessageService();