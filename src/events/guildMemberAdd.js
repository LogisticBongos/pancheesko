const { Events } = require("discord.js");
const { colors, welcomeEmbed } = require("../utils/embeds");
const { logMemberEvent, sendToChannel } = require("../utils/logging");
const { safeBanMinus15 } = require("../utils/moderation");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member, client) {
    await sendToChannel(client, client.config.channels.welcome, {
      content: `Welcome ${member}!`,
      embeds: [welcomeEmbed(member, client)]
    });

    await logMemberEvent(
      client,
      member.guild,
      "Member joined",
      `${member.user.tag} (${member.id}) joined the server.`,
      colors.success
    );

    await safeBanMinus15(member, client, "member join");
  }
};
