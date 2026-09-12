const { ChannelType, PermissionFlagsBits } = require("discord.js");

const updateTimers = new Map();
const counterName = (label, count) => `${label}  ﹕  ${count}`;

async function memberCounts(guild) {
  const members = await guild.members.fetch();
  return {
    humans: members.filter((member) => !member.user.bot).size,
    total: members.size
  };
}

async function renameCounterChannel(guild, channelId, name) {
  if (!channelId) return false;

  const channel = await guild.channels.fetch(channelId).catch(() => null);
  if (!channel || channel.name === name) return Boolean(channel);

  await channel.setName(name, "updated member counter");
  return true;
}

async function updateMemberCountersNow(client, guild) {
  const { memberCount, humanCount } = client.config.channels;
  if (!memberCount && !humanCount) return;

  const counts = await memberCounts(guild);
  await renameCounterChannel(guild, memberCount, counterName("members", counts.total));
  await renameCounterChannel(guild, humanCount, counterName("people", counts.humans));
}

function scheduleMemberCounterUpdate(client, guild) {
  const existing = updateTimers.get(guild.id);
  if (existing) clearTimeout(existing);

  const timer = setTimeout(() => {
    updateTimers.delete(guild.id);
    updateMemberCountersNow(client, guild).catch((error) => {
      console.warn(`could not update member counters for ${guild.id}: ${error.message}`);
    });
  }, 5_000);

  updateTimers.set(guild.id, timer);
}

async function createCounterChannel(guild, name) {
  const channel = await guild.channels.create({
    name,
    type: ChannelType.GuildVoice,
    permissionOverwrites: [
      {
        id: guild.roles.everyone.id,
        deny: [PermissionFlagsBits.Connect]
      }
    ],
    reason: "created member counter channel"
  });

  await channel.setPosition(0).catch(() => {});
  return channel;
}

async function createMemberCounters(client, guild) {
  const counts = await memberCounts(guild);
  const totalChannel = await createCounterChannel(guild, counterName("members", counts.total));
  const humanChannel = await createCounterChannel(guild, counterName("people", counts.humans));

  client.config.channels.memberCount = totalChannel.id;
  client.config.channels.humanCount = humanChannel.id;

  return {
    humanChannel,
    totalChannel
  };
}

module.exports = {
  createMemberCounters,
  scheduleMemberCounterUpdate,
  updateMemberCountersNow
};
