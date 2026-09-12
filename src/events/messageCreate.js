const { Events } = require("discord.js");
const { handleBoostMessage } = require("../utils/boosts");
const { findResponse } = require("../utils/responses");

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (await handleBoostMessage(message, client)) return;

    if (!message.guild || message.author.bot) return;

    const match = findResponse(message.guild.id, message.content);
    if (!match) return;

    const [, entry] = match;
    await message.channel.send(entry.response);
  }
};
