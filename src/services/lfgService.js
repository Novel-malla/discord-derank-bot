const config = require("../config/config.json");

const lfgRepository = require("../repositories/lfgRepository");
const lfgMemberRepository = require("../repositories/lfgMemberRepository");

const userService = require("./userService");
const lfgViewService = require("./lfgViewService");

const createLFGEmbed = require("../embeds/lfgEmbed");
const createLFGButtons = require("../components/lfgButtons");
const lfgValidationService = require("./lfgValidationService");
const lfgMessageService = require("./lfgMessageService");
const createLFGListEmbed = require("../embeds/lfgListEmbed");

class LFGService {

    async create(interaction, data) {

        const channel = interaction.guild.channels.cache.get(
            config.channels.lfg
        );

        if (!channel) {
            throw new Error("LFG channel not found.");
        }

        let lfgId;

        try {

            await userService.syncMember(interaction.member);

            lfgId = lfgRepository.create({
                guild_id: interaction.guild.id,
                channel_id: channel.id,
                host_id: interaction.user.id,
                game: data.game.key,
                rank: data.rank,
                max_players: data.maxPlayers,
                description: data.description
            });

            lfgMemberRepository.addMember(
                lfgId,
                interaction.user.id
            );

            const embed = createLFGEmbed({
                ...data,
                host: interaction.member.displayName,
                members: [interaction.member.displayName],
                status: "OPEN"
            });

            const message = await channel.send({
                embeds: [embed],
                components: [
                    createLFGButtons(lfgId)
                ]
            });

            console.log("✅ LFG message created");

            lfgRepository.updateMessageId(
                lfgId,
                message.id
            );

            console.log("Creating thread...");

            // Create a thread for this LFG
            const thread = await message.startThread({
                name: `${interaction.member.displayName}'s Group Chat`,
                autoArchiveDuration: 1440 // 24 hours
            });

            // Save thread ID
            lfgRepository.updateGroupChannelId(
                lfgId,
                thread.id
            );

            // Welcome message
            await thread.send({
                content:
                    `👋 Welcome ${interaction.user}!\n\n` +
                    `This is your private LFG group chat.\n` +
                    `Anyone who joins this LFG will automatically be added here.`
            });

            console.log("Thread created:", thread.id);

            return message;

        } catch (error) {

            if (lfgId) {
                lfgRepository.delete(lfgId);
            }

            throw error;

        }

    }

    async updatePartyStatus(lfgId) {

        const lfg = lfgRepository.findById(lfgId);

        if (!lfg || lfg.status === "CLOSED") {
            return;
        }

        const memberCount =
            lfgMemberRepository.getMemberCount(lfgId);

        const status =
            memberCount >= lfg.max_players
                ? "FULL"
                : "OPEN";

        lfgRepository.updateStatus(
            lfgId,
            status
        );

    }

    async join(interaction) {

        const lfgId = Number(
            interaction.customId.split(":")[1]
        );

        const lfg =
            lfgRepository.findById(lfgId);

        const alreadyJoined =
            lfgMemberRepository.isMember(
                lfgId,
                interaction.user.id
            );

        const memberCount =
            lfgMemberRepository.getMemberCount(
                lfgId
            );

        const validation =
            lfgValidationService.canJoin(
                lfg,
                alreadyJoined,
                memberCount
            );

        if (!validation.success) {

            return interaction.reply({
                ephemeral: true,
                content: validation.message
            });

        }

        await userService.syncMember(
            interaction.member
        );

        lfgMemberRepository.addMember(
            lfgId,
            interaction.user.id
        );

        try {

            const thread =
                await interaction.guild.channels.fetch(
                    lfg.group_channel_id
                );

            if (thread?.isThread()) {

                await thread.members.add(
                    interaction.user.id
                );

                await thread.send({
                    content:
                        `# 🎮 Party Chat

                        Welcome ${interaction.user}!

                        Use this thread to:

                        • Share your Riot ID / Steam ID
                        • Decide who's inviting
                        • Coordinate before the match
                        • Chat during queue

                        Everyone who joins the LFG will automatically be added here.`
                });

            }

        } catch (error) {

            console.error(
                "Failed to add member to thread:",
                error
            );

        }

        await this.updatePartyStatus(
            lfgId
        );

        await lfgMessageService.refresh(
            interaction.client,
            interaction.guild.id,
            lfgId
        );

        return interaction.reply({
            ephemeral: true,
            content: "✅ Joined successfully!"
        });

    }

    async leave(interaction) {

        const lfgId = Number(
            interaction.customId.split(":")[1]
        );

        const lfg =
            lfgRepository.findById(lfgId);

        const isMember =
            lfgMemberRepository.isMember(
                lfgId,
                interaction.user.id
            );

        const validation =
            lfgValidationService.canLeave(
                lfg,
                isMember,
                interaction.user.id
            );

        if (!validation.success) {

            return interaction.reply({
                ephemeral: true,
                content: validation.message
            });

        }

        lfgMemberRepository.removeMember(
            lfgId,
            interaction.user.id
        );

        try {

            const thread =
                await interaction.guild.channels.fetch(
                    lfg.group_channel_id
                );

            if (thread?.isThread()) {

                await thread.members.remove(
                    interaction.user.id
                );

                await thread.send(
                    `👋 ${interaction.user} left the party.`
                );

            }

        } catch (error) {

            console.error(
                "Failed to remove member from thread:",
                error
            );

        }

        await this.updatePartyStatus(
            lfgId
        );

        await lfgMessageService.refresh(
            interaction.client,
            interaction.guild.id,
            lfgId
        );

        return interaction.reply({
            ephemeral: true,
            content: "👋 You left the party."
        });

    }

    async close(interaction) {

        const lfgId = Number(
            interaction.customId.split(":")[1]
        );

        const lfg =
            lfgRepository.findById(lfgId);

        const validation =
            lfgValidationService.canClose(
                lfg,
                interaction.user.id
            );

        if (!validation.success) {

            return interaction.reply({
                ephemeral: true,
                content: validation.message
            });

        }

        try {

            const thread =
                await interaction.guild.channels.fetch(
                    lfg.group_channel_id
                );

            if (thread) {

                await thread.delete();

            }

        } catch (error) {

            console.error(
                "Failed to delete thread:",
                error
            );

        }

        lfgRepository.updateStatus(
            lfgId,
            "CLOSED"
        );

        await lfgMessageService.refresh(
            interaction.client,
            interaction.guild.id,
            lfgId
        );

        return interaction.reply({
            ephemeral: true,
            content: "🔒 Party closed."
        });

    }

    async list(interaction) {

        const lfgs =
            lfgRepository.findActive();

        const views = await Promise.all(

            lfgs.map(lfg =>
                lfgViewService.build(
                    interaction.guild,
                    lfg.id
                )
            )

        );

        await interaction.reply({

            embeds: [
                createLFGListEmbed(views)
            ]

        });

    }

}

module.exports = new LFGService();