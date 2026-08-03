const config = require("../config/config.json");
const lfgService = require("../services/lfgService");

async function modalHandler(interaction) {

    if (!interaction.customId.startsWith("lfg_create:")) return;

    const gameKey = interaction.customId.split(":")[1];

    const game = config.selfRoles.find(
        role => role.key === gameKey
    );

    if (!game) {
        return interaction.reply({
            ephemeral: true,
            content: "❌ Invalid game selected."
        });
    }

    const rank = interaction.fields.getTextInputValue("rank");

    const players = Number(
        interaction.fields.getTextInputValue("players")
    );

    const description =
        interaction.fields.getTextInputValue("description");

    // Validation
    if (Number.isNaN(players)) {
        return interaction.reply({
            ephemeral: true,
            content: "❌ Party size must be a valid number."
        });
    }

    if (players < 2) {
        return interaction.reply({
            ephemeral: true,
            content: "❌ Party size must be at least 2."
        });
    }

    if (game.maxPartySize && players > game.maxPartySize) {
        return interaction.reply({
            ephemeral: true,
            content: `❌ ${game.name} supports a maximum party size of ${game.maxPartySize}.`
        });
    }

    try {

        await lfgService.create(interaction, {
            game,
            rank,
            maxPlayers: players,
            description
        });

        await interaction.reply({
            ephemeral: true,
            content: "✅ LFG created successfully!"
        });

    } catch (error) {

        console.error(error);

        await interaction.reply({
            ephemeral: true,
            content: "❌ Failed to create your LFG post."
        });

    }
}

module.exports = modalHandler;