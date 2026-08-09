const { Events } = require("discord.js");
const { colors, welcomeEmbed } = require("../utils/embeds");
const { logMemberEvent, sendToChannel } = require("../utils/logging");
const { safeBanMinus15 } = require("../utils/moderation");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member, client) {
    const verifyStep = client.config.channels.verify ? `read the rules, then verify in <#${client.config.channels.verify}>.` : "read the rules, then head to verify.";

    await sendToChannel(client, client.config.channels.mail, {
      content: `welcome ${member}. ${verifyStep}`,
      embeds: [welcomeEmbed(member, client)]
    });

    if (client.config.onboarding.unverifiedRoleId) {
      const role = member.guild.roles.cache.get(client.config.onboarding.unverifiedRoleId);
      if (role) await member.roles.add(role, "New member pending bot onboarding");
    }

    await logMemberEvent(
      client,
      member.guild,
      "member joined",
      `${member.user.tag} (${member.id}) joined the server.`,
      colors.success
    );

    await safeBanMinus15(member, client, "member join");
  }
};
