const fs = require("fs");
const path = require("path");

module.exports = (client) => {
    client.commands = new Map();

    const commandsPath = path.join(__dirname, "..", "commands");

    const folders = fs.readdirSync(commandsPath);

    for (const folder of folders) {

        const commandFiles = fs
            .readdirSync(path.join(commandsPath, folder))
            .filter(file => file.endsWith(".js"));

        for (const file of commandFiles) {

            const command = require(path.join(commandsPath, folder, file));

            client.commands.set(command.data.name, command);
        }
    }
};