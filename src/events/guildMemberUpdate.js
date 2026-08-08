const { Events } = require("discord.js");
const { safeBanMinus15 } = require("../utils/moderation");

module.exports = {
  name: Events.GuildMemberUpdate,
  async execute(oldMember, newMember, client) {
    const roleId = client.config.autoBan.minus15RoleId;
    if (!roleId) return;

    const hadRole = oldMember.roles.cache.has(roleId);
    const hasRole = newMember.roles.cache.has(roleId);
    if (!hadRole && hasRole) {
      await safeBanMinus15(newMember, client, "role assigned");
    }
  }
};
