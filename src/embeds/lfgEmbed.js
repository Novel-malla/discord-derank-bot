const { EmbedBuilder } = require("discord.js");

function createLFGEmbed(lfg) {

    const members = lfg.members ?? [];
    const memberList =
        members.length > 0
            ? members.map(member => `• ${member}`).join("\n")
            : "No members yet.";

    return new EmbedBuilder()
        .setColor("#5865F2")
        .setTitle(`${lfg.game.emoji} Looking For Group`)
        .addFields(
            {
                name: "🎮 Game",
                value: lfg.game.name,
                inline: true
            },
            {
                name: "🏆 Rank",
                value: lfg.rank || "Unranked",
                inline: true
            },
            {
                name: "👥 Party",
                value: `${members.length} / ${lfg.maxPlayers}`,
                inline: true
            },
            {
                name: "📝 Description",
                value: lfg.description || "No description provided."
            },
            {
                name: "👑 Host",
                value: lfg.host,
                inline: true
            },
            {
                name: "👥 Members",
                value: memberList
            },
            {
                name: "📌 Status",
                value: lfg.status,
                inline: true
            },
        )
        .setTimestamp();

}

module.exports = createLFGEmbed;