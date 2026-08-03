const config = require("../config/config.json");

const lfgRepository = require("../repositories/lfgRepository");
const lfgMessageService = require("./lfgMessageService");

class LFGCleanupService {

    start(client) {

        const interval =
            config.lfg.cleanupIntervalMinutes * 60 * 1000;

        // Run once immediately
        this.cleanup(client);

        setInterval(() => {
            this.cleanup(client);
        }, interval);

        console.log(
            `[LFG Cleanup] Running every ${config.lfg.cleanupIntervalMinutes} minute(s)`
        );

    }

    async cleanup(client) {

        try {

            const expiredLfgs =
                lfgRepository.findExpired(
                    config.lfg.expireAfterMinutes
                );

            if (!expiredLfgs.length) {
                return;
            }

            console.log(
                `[LFG Cleanup] Found ${expiredLfgs.length} expired LFG(s)`
            );

            for (const lfg of expiredLfgs) {

                try {

                    lfgRepository.updateStatus(
                        lfg.id,
                        "CLOSED"
                    );

                    await lfgMessageService.refresh(
                        client,
                        lfg.guild_id,
                        lfg.id
                    );

                    console.log(
                        `[LFG Cleanup] Closed LFG #${lfg.id}`
                    );

                } catch (error) {

                    console.error(
                        `[LFG Cleanup] Failed to close LFG #${lfg.id}`,
                        error
                    );

                }

            }

        } catch (error) {

            console.error("[LFG Cleanup]", error);

        }

    }

}

module.exports = new LFGCleanupService();