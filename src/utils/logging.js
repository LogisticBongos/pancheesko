const { colors, logEmbed } = require("./embeds");

async function sendToChannel(client, channelId, payload) {
  if (!channelId) return null;

  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel?.isTextBased()) return null;
    return channel.send(payload);
  } catch (error) {
    console.warn(`Could not send to channel ${channelId}: ${error.message}`);
    return null;
  }
}

async function logMemberEvent(client, guild, title, description, color = colors.muted) {
  return sendToChannel(client, client.config.channels.memberLog, {
    embeds: [logEmbed(client, title, description, color)]
  });
}

async function logModeration(client, guild, title, description, color = colors.info) {
  const channelId = client.config.channels.modLog || client.config.channels.memberLog;
  return sendToChannel(client, channelId, {
    embeds: [logEmbed(client, title, description, color)]
  });
}

module.exports = {
  logMemberEvent,
  logModeration,
  sendToChannel
};
