const {
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

const config = require("../../config/config.json");
const lfgService = require("../../services/lfgService");

const command = new SlashCommandBuilder()
    .setName("lfg")
    .setDescription("Looking For Group commands")

    .addSubcommand(subcommand => {

        subcommand
            .setName("create")
            .setDescription("Create a Looking For Group post.")
            .addStringOption(option => {

                option
                    .setName("game")
                    .setDescription("Select the game")
                    .setRequired(true);

                config.selfRoles
                    .filter(role => role.type === "game")
                    .forEach(game => {
                        option.addChoices({
                            name: `${game.emoji} ${game.name}`,
                            value: game.key
                        });
                    });

                return option;

            });

        return subcommand;

    })

    .addSubcommand(subcommand =>

        subcommand
            .setName("list")
            .setDescription("View all active LFG posts")

    );

module.exports = {
    data: command,

    async execute(interaction) {

        const subcommand =
            interaction.options.getSubcommand();

        switch (subcommand) {

            case "create": {

                const selectedGame =
                    interaction.options.getString("game");

                const modal = new ModalBuilder()
                    .setCustomId(`lfg_create:${selectedGame}`)
                    .setTitle("Create LFG");

                const rankInput = new TextInputBuilder()
                    .setCustomId("rank")
                    .setLabel("Rank")
                    .setPlaceholder("Diamond")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false);

                const playersInput = new TextInputBuilder()
                    .setCustomId("players")
                    .setLabel("Party Size")
                    .setPlaceholder("5")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const descriptionInput = new TextInputBuilder()
                    .setCustomId("description")
                    .setLabel("Description")
                    .setPlaceholder("Looking for chill teammates.")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(rankInput),
                    new ActionRowBuilder().addComponents(playersInput),
                    new ActionRowBuilder().addComponents(descriptionInput)
                );

                return interaction.showModal(modal);
            }

            case "list":
                return lfgService.list(interaction);

            default:
                return interaction.reply({
                    content: "Unknown subcommand.",
                    ephemeral: true
                });

        }

    }
};