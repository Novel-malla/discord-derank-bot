const { EmbedBuilder } = require("discord.js");

function createLFGListEmbed(lfgs) {

    const embed = new EmbedBuilder()
        .setTitle("🎮 Active LFGs")
        .setColor("Green");

    if (!lfgs.length) {

        embed.setDescription("There are currently no active LFGs.");

        return embed;
    }

    lfgs.forEach((lfg, index) => {

        embed.addFields({
            name: `${index + 1}. ${lfg.game.emoji} ${lfg.game.name}`,
            value: [
                `**Rank:** ${lfg.rank || "Any"}`,
                "",
                `**Party:** ${lfg.members.length}/${lfg.maxPlayers}`,
                "",
                `**Host:** ${lfg.host}`,
                "",
                `**Status:** ${lfg.status}`,
                "",
                `[🔗 Jump to LFG](${lfg.url})`,
                ""
            ].join("\n"),
            inline: false
        });

    });

    return embed;

}

module.exports = createLFGListEmbed;