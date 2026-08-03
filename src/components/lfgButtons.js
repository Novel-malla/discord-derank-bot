const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

function createLFGButtons(lfgId, disabled = false) {

    return new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`lfg_join:${lfgId}`)
                .setLabel("Join")
                .setStyle(ButtonStyle.Success)
                .setDisabled(disabled),

            new ButtonBuilder()
                .setCustomId(`lfg_leave:${lfgId}`)
                .setLabel("Leave")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(disabled),

            new ButtonBuilder()
                .setCustomId(`lfg_close:${lfgId}`)
                .setLabel("Close")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(disabled)
        );

}

module.exports = createLFGButtons;