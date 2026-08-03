const config = require("../config/config.json");

async function selectMenuHandler(interaction) {

    if (interaction.customId !== "self_roles") return;

    const member = interaction.member;

    // All self-assignable roles
    const selfRoles = config.selfRoles;

    // Role IDs the user currently has
    const currentRoleIds = member.roles.cache.map(role => role.id);

    // Self-role IDs the user currently has
    const currentSelfRoleIds = selfRoles
        .map(role => role.id)
        .filter(roleId => currentRoleIds.includes(roleId));

    // Role IDs selected from the dropdown
    const selectedRoleIds = interaction.values
        .map(value =>
            selfRoles.find(role => role.key === value)?.id
        )
        .filter(Boolean);

    // Determine what to add
    const rolesToAdd = selectedRoleIds.filter(
        roleId => !currentSelfRoleIds.includes(roleId)
    );

    // Determine what to remove
    const rolesToRemove = currentSelfRoleIds.filter(
        roleId => !selectedRoleIds.includes(roleId)
    );

    if (rolesToRemove.length > 0) {
        await member.roles.remove(rolesToRemove);
    }

    if (rolesToAdd.length > 0) {
        await member.roles.add(rolesToAdd);
    }

    await interaction.update({
        content: "✅ Your game roles have been updated successfully!",
        components: []
    });

}

module.exports = selectMenuHandler;