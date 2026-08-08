const { Events } = require("discord.js");
const { colors } = require("../utils/embeds");
const { logMemberEvent } = require("../utils/logging");

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member, client) {
    await logMemberEvent(
      client,
      member.guild,
      "Member left",
      `${member.user.tag} (${member.id}) left the server.`,
      colors.danger
    );
  }
};
