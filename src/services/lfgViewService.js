const config = require("../config/config.json");

const lfgRepository = require("../repositories/lfgRepository");
const lfgMemberRepository = require("../repositories/lfgMemberRepository");

class LFGViewService {

    async build(guild, lfgId) {

        const lfg = lfgRepository.findById(lfgId);

        if (!lfg) {
            return null;
        }

        const members =
            lfgMemberRepository.getMembers(lfgId);

        const memberNames = [];

        for (const member of members) {

            try {

                const guildMember =
                    await guild.members.fetch(
                        member.user_id
                    );

                memberNames.push(
                    guildMember.displayName
                );

            } catch {

                memberNames.push("Unknown User");

            }

        }

        let host = "Unknown User";

        try {

            host = (
                await guild.members.fetch(
                    lfg.host_id
                )
            ).displayName;

        } catch { }

        const game = config.selfRoles.find(
            role => role.key === lfg.game
        );

        return {
            ...lfg,
            game,
            host,
            members: memberNames,
            maxPlayers: lfg.max_players,
            url: `https://discord.com/channels/${lfg.guild_id}/${lfg.channel_id}/${lfg.message_id}`
        };

    }

}

module.exports = new LFGViewService();