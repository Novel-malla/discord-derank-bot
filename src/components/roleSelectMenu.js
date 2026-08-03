const {
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

const config = require("../config/config.json");

function createRoleSelectMenu(member) {

    const options = config.selfRoles.map(role => ({
        label: role.label,
        value: role.key,
        emoji: role.emoji,
        default: member.roles.cache.has(role.id)
    }));

    const menu = new StringSelectMenuBuilder()
        .setCustomId("self_roles")
        .setPlaceholder("Choose your game roles...")
        .setMinValues(0)
        .setMaxValues(config.selfRoles.length)
        .addOptions(options);

    return new ActionRowBuilder().addComponents(menu);
}

module.exports = {
    createRoleSelectMenu
};