require("dotenv").config();

const fs = require("fs");
const path = require("path");

const {
    REST,
    Routes
} = require("discord.js");

const commands = [];

const folders = fs.readdirSync(path.join(__dirname, "..", "commands"));

for (const folder of folders) {

    const files = fs.readdirSync(
        path.join(__dirname, "..", "commands", folder)
    );

    for (const file of files) {

        const command = require(
            path.join(__dirname, "..", "commands", folder, file)
        );

        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {

    try {

        await rest.put(

            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),

            { body: commands }

        );

        console.log("Slash commands deployed!");

    } catch (err) {

        console.error(err);

    }

})();