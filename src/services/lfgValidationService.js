class LFGValidationService {

    canJoin(lfg, alreadyJoined, memberCount) {

        if (!lfg) {
            return {
                success: false,
                message: "❌ This LFG no longer exists."
            };
        }

        if (lfg.status === "CLOSED") {
            return {
                success: false,
                message: "❌ This party has been closed."
            };
        }

        if (alreadyJoined) {
            return {
                success: false,
                message: "⚠️ You are already in this party."
            };
        }

        if (memberCount >= lfg.max_players) {
            return {
                success: false,
                message: "❌ This party is already full."
            };
        }

        if (lfg.status === "CLOSED") {
            return {
                success: false,
                message: "❌ This party has been closed."
            };
        }

        if (lfg.status === "FULL") {
            return {
                success: false,
                message: "❌ This party is already full."
            };
        }

        return {
            success: true
        };

    }

    canLeave(lfg, isMember, userId) {

        if (!lfg) {
            return {
                success: false,
                message: "❌ This LFG no longer exists."
            };
        }

        if (lfg.status === "CLOSED") {
            return {
                success: false,
                message: "❌ This party has already been closed."
            };
        }

        if (lfg.host_id === userId) {
            return {
                success: false,
                message: "❌ The host cannot leave the party. Close it instead."
            };
        }

        if (!isMember) {
            return {
                success: false,
                message: "⚠️ You are not part of this party."
            };
        }

        return {
            success: true
        };

    }

    canClose(lfg, userId) {

        if (!lfg) {
            return {
                success: false,
                message: "❌ This LFG no longer exists."
            };
        }

        if (lfg.host_id !== userId) {
            return {
                success: false,
                message: "❌ Only the host can close this party."
            };
        }

        if (lfg.status === "CLOSED") {
            return {
                success: false,
                message: "⚠️ This party is already closed."
            };
        }

        return {
            success: true
        };

    }

}

module.exports = new LFGValidationService();