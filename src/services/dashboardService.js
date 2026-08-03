const fs = require("fs");
const path = require("path");

const { createWelcomeEmbed } = require("../embeds/welcomeEmbed");
const { createWelcomeButtons } = require("../components/welcomeButtons");

const welcomeFile = path.join(
    __dirname,
    "..",
    "database",
    "welcome.json"
);

function saveDashboard(channelId, messageId) {
    fs.writeFileSync(
        welcomeFile,
        JSON.stringify(
            {
                channelId,
                messageId
            },
            null,
            4
        )
    );
}

function loadDashboard() {
    if (!fs.existsSync(welcomeFile))
        return null;

    return JSON.parse(
        fs.readFileSync(welcomeFile)
    );
}

async function updateDashboard(client, channel) {

    const data = loadDashboard();

    const embed = await createWelcomeEmbed(channel.guild);
    const buttons = createWelcomeButtons();

    if (!data) {

        const message = await channel.send({
            embeds: [embed],
            components: [buttons]
        });

        saveDashboard(channel.id, message.id);

        return;
    }

    try {

        const dashboardChannel =
            await client.channels.fetch(data.channelId);

        const dashboardMessage =
            await dashboardChannel.messages.fetch(data.messageId);

        await dashboardMessage.edit({
            embeds: [embed],
            components: [buttons]
        });

    } catch {

        const message = await channel.send({
            embeds: [embed],
            components: [buttons]
        });

        saveDashboard(channel.id, message.id);

    }

}

module.exports = {
    saveDashboard,
    loadDashboard,
    updateDashboard
};