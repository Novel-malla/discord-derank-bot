const {
    EmbedBuilder
} = require("discord.js");

const config = require("../config/config.json");

async function createWelcomeEmbed(guild) {

    const streamers = config.streamers
        .map(streamer => {

            const role = guild.roles.cache.get(streamer.role);

            if (!role) return null;

            return `• ${streamer.name}`;

        })
        .filter(Boolean)
        .join("\n");

    const ownerRole = guild.roles.cache.get(config.roles.owner);
    console.log("Configured Mod ID:", config.roles.mod);

    const modRole = guild.roles.cache.get(config.roles.mod);

    console.log("Found Role:", modRole?.name);
    console.log("Actual Role ID:", modRole?.id);

    console.log("Mod Role:", modRole?.name);
    console.log("Members:", modRole?.members.size);

    guild.roles.cache.forEach(role => {
        console.log(role.name, role.id);
    });

    const ownerMembers = ownerRole
        ? ownerRole.members.map(member => `👑 ${member}`).join("\n")
        : "";

    const moderators = guild.members.cache
        .filter(member => member.roles.cache.has(config.roles.mod))
        .map(member => `🛡 ${member}`)
        .join("\n");

    const staff =
        [ownerMembers, moderators]
            .filter(Boolean)
            .join("\n\n") || "No staff";

    console.log(guild.members.cache.size);

    return new EmbedBuilder()
        .setColor("#5865F2")

        .setTitle(`🎮 Welcome to ${config.serverName}`)

        .setDescription(
            "Play games • Meet new people • Support our streamers\n\n" +
            "Welcome to the Derank Services community!"
        )

        .addFields(

            {
                name: "═══ 🎮 Games we play ═══",
                value:
                    "• Valorant\n" +
                    "• Minecraft\n" +
                    "• Phasmophobia\n" +
                    "• CS2",
                inline: false
            },

            {
                name: "\u200B",
                value: "\u200B",
                inline: false
            },

            {
                name: "═══ 🎥 Featured Creators ═══",
                value: streamers || "No streamers yet.",
                inline: false
            },

            {
                name: "\u200B",
                value: "\u200B",
                inline: false
            },

            {
                name: "═══ 🛡 Staff ═══",
                value: staff,
                inline: false
            },

            {
                name: "\u200B",
                value: "\u200B",
                inline: false
            },

            {
                name: "═══ 🚀 Getting Started ═══",
                value:
                    "• 📜 Read the Rules\n" +
                    "• 🎭 Pick your Roles\n" +
                    "• 💬 Introduce Yourself\n" +
                    "• 🎮 Join a Voice Channel",
                inline: false
            }

        )

        .setFooter({
            text: "Derank Services"
        })

        .setTimestamp();

}

module.exports = {
    createWelcomeEmbed
};