const { ActivityType, Events } = require("discord.js");
const { safeBanMinus15 } = require("../utils/moderation");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`logged in as ${client.user.tag}`);
    client.user.setPresence({
      activities: [{ name: "pancheesko", type: ActivityType.Watching }],
      status: "online"
    });

    if (!client.config.autoBan.scanOnReady || !client.config.autoBan.minus15RoleId) return;

    for (const guild of client.guilds.cache.values()) {
      const roleId = client.config.autoBan.minus15RoleId;
      const members = await guild.members.fetch();
      const flaggedMembers = members.filter((member) => member.roles.cache.has(roleId));

      for (const member of flaggedMembers.values()) {
        await safeBanMinus15(member, client, "startup scan");
      }
    }
  }
};
