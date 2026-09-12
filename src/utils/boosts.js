const { MessageType } = require("discord.js");
const { boostEmbed } = require("./embeds");

const boostMessageTypes = new Set([
  MessageType.GuildBoost,
  MessageType.GuildBoostTier1,
  MessageType.GuildBoostTier2,
  MessageType.GuildBoostTier3
]);

async function handleBoostMessage(message, client) {
  if (!message.guild || !boostMessageTypes.has(message.type)) return false;

  const member = message.member || await message.guild.members.fetch(message.author.id).catch(() => null);
  if (!member) return false;

  await message.channel.send({
    embeds: [boostEmbed(member, client)],
    allowedMentions: { users: [member.id] }
  });

  return true;
}

module.exports = {
  handleBoostMessage
};
