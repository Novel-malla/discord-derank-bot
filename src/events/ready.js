const lfgCleanupService =
    require("../services/lfgCleanupService");

module.exports = {
    name: "ready",
    once: true,

    execute(client) {
        console.log(`${client.user.tag} is online!`);

        lfgCleanupService.start(client);

        const guild = client.guilds.cache.first();

        console.log("Guild Members:", guild.memberCount);

        guild.members.fetch().then(members => {
            console.log("Fetched Members:", members.size);

            members.forEach(member => {
                console.log(
                    member.user.username,
                    member.roles.cache.map(r => r.name)
                );
            });
        });
    }
};