const lfgRepository =
    require("../repositories/lfgRepository");

const lfgMessageService =
    require("./lfgMessageService");

class LFGCleanupService {

    constructor() {

        this.interval = null;

    }

    start(client) {

        if (this.interval) {
            return;
        }

        console.log(
            "🧹 LFG cleanup service started."
        );

        // Run once immediately
        this.cleanup(client);

        // Then every 5 minutes
        this.interval = setInterval(
            () => this.cleanup(client),
            5 * 60 * 1000
        );

    }

    async cleanup(client) {

        try {

            const inactiveLFGs =
                lfgRepository.findInactive(2);

            if (!inactiveLFGs.length) {
                return;
            }

            console.log(
                `🧹 Found ${inactiveLFGs.length} inactive LFG(s).`
            );

            for (const lfg of inactiveLFGs) {

                await this.closeLFG(
                    client,
                    lfg
                );

            }

        } catch (error) {

            console.error(
                "LFG cleanup error:",
                error
            );

        }

    }

    async closeLFG(client, lfg) {

        try {

            console.log(
                `🧹 Closing inactive LFG #${lfg.id}`
            );

            /*
             * Delete the associated group thread
             */
            if (lfg.group_channel_id) {

                try {

                    const guild =
                        client.guilds.cache.get(
                            lfg.guild_id
                        );

                    if (guild) {

                        const thread =
                            await guild.channels.fetch(
                                lfg.group_channel_id
                            );

                        if (thread) {

                            await thread.delete();

                            console.log(
                                `🗑️ Deleted LFG thread ${lfg.group_channel_id}`
                            );

                        }

                    }

                } catch (error) {

                    console.error(
                        `Failed to delete LFG thread ${lfg.group_channel_id}:`,
                        error
                    );

                }

            }

            /*
             * Mark LFG as closed
             */
            lfgRepository.updateStatus(
                lfg.id,
                "CLOSED"
            );

            /*
             * Refresh original LFG message
             */
            try {

                const guild =
                    client.guilds.cache.get(
                        lfg.guild_id
                    );

                if (guild) {

                    await lfgMessageService.refresh(
                        client,
                        guild.id,
                        lfg.id
                    );

                }

            } catch (error) {

                console.error(
                    `Failed to refresh LFG #${lfg.id}:`,
                    error
                );

            }

            console.log(
                `✅ LFG #${lfg.id} automatically closed.`
            );

        } catch (error) {

            console.error(
                `Failed to close inactive LFG #${lfg.id}:`,
                error
            );

        }

    }

}

module.exports =
    new LFGCleanupService();