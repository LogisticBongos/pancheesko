const { Events } = require("discord.js");
const { handleReactionRole } = require("../utils/roles");

module.exports = {
  name: Events.MessageReactionAdd,
  async execute(reaction, user, client) {
    await handleReactionRole(reaction, user, client, true);
  }
};
