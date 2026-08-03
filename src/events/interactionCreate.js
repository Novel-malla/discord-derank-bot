const buttonHandler = require("../handlers/buttonHandler");
const selectMenuHandler = require("../handlers/selectMenuHandler");

module.exports = {

    name: "interactionCreate",

    async execute(interaction) {

        // Slash Commands
        if (interaction.isChatInputCommand()) {

            const command = interaction.client.commands.get(
                interaction.commandName
            );

            if (!command) return;

            try {

                await command.execute(interaction);

            } catch (err) {

                console.error(err);

                await interaction.reply({

                    content: "Something went wrong.",

                    ephemeral: true

                });

            }

            return;
        }

        // Buttons
        if (interaction.isButton()) {

            try {

                await buttonHandler(interaction);

            } catch (err) {

                console.error(err);

            }

            return;
        }

        if (interaction.isStringSelectMenu()) {

            try {

                await selectMenuHandler(interaction);

            } catch (err) {

                console.error(err);

                await interaction.reply({
                    content: "Something went wrong while updating your roles.",
                    ephemeral: true
                });

            }

            return;
        }

        if (interaction.isModalSubmit()) {
            return require("../handlers/modalHandler")(interaction);
        }

    }

};