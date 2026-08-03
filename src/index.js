require("dotenv").config();
const initializeDatabase = require("./database/initDatabase");

const {
    Client,
    GatewayIntentBits
} = require("discord.js");

const loadEvents = require("./handlers/eventHandler");
const loadCommands = require("./handlers/commandHandler");

const client = new Client({

    intents: [

        GatewayIntentBits.Guilds,

        GatewayIntentBits.GuildMembers,

        GatewayIntentBits.GuildMessages,

        GatewayIntentBits.MessageContent

    ]

});

initializeDatabase();

loadCommands(client);
loadEvents(client);

client.login(process.env.TOKEN);