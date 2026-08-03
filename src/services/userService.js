const userRepository = require("../repositories/userRepository");

class UserService {

    async syncMember(member) {

        const user = {
            id: member.id,
            username: member.user.username,
            display_name: member.displayName,
            avatar_url: member.displayAvatarURL(),
            joined_at: member.joinedAt.toISOString()
        };

        const existing = userRepository.findById(user.id);

        if (!existing) {
            userRepository.create(user);
            return;
        }

        userRepository.update(user);

    }

}

module.exports = new UserService();