const createLFGEmbed = require("../embeds/lfgEmbed");
const createLFGButtons = require("../components/lfgButtons");

const lfgViewService = require("./lfgViewService");

class LFGMessageService {

    async refresh(client, guildId, lfgId) {

        try {

            const guild = await client.guilds.fetch(guildId);

            if (!guild) {
                return;
            }

            const lfg = await lfgViewService.build(
                guild,
                lfgId
            );

            if (!lfg) {
                return;
            }

            const channel = await guild.channels.fetch(
                lfg.channel_id
            );

            if (!channel) {
                return;
            }

            const message = await channel.messages.fetch(
                lfg.message_id
            );

            await message.edit({
                embeds: [
                    createLFGEmbed(lfg)
                ],
                components: [
                    createLFGButtons(
                        lfg.id,
                        lfg.status === "CLOSED"
                    )
                ]
            });

            return true;

        } catch (error) {
            console.error(
                `[LFG Message Service] Failed to refresh LFG #${lfgId}`,
                error
            );

            return false;
        }

    }

}

module.exports = new LFGMessageService();