const fs = require("node:fs");
const path = require("node:path");
const { EmbedBuilder } = require("discord.js");
const { colors } = require("./embeds");

const dataPath = path.join(__dirname, "..", "..", "data", "moderation-records.json");

function readRecords() {
  if (!fs.existsSync(dataPath)) return {};
  return JSON.parse(fs.readFileSync(dataPath, "utf8"));
}

function writeRecords(records) {
  fs.mkdirSync(path.dirname(dataPath), { recursive: true });
  fs.writeFileSync(dataPath, JSON.stringify(records, null, 2));
}

function memberRecord(records, guildId, userId) {
  records[guildId] ||= {};
  records[guildId][userId] ||= { warnings: [], mutes: [] };
  return records[guildId][userId];
}

function addWarning(guildId, userId, moderatorId, reason) {
  const records = readRecords();
  const record = memberRecord(records, guildId, userId);
  record.warnings.push({ moderatorId, reason, at: new Date().toISOString() });
  writeRecords(records);
  return record;
}

function addMute(guildId, userId, moderatorId, minutes, reason) {
  const records = readRecords();
  const record = memberRecord(records, guildId, userId);
  record.mutes.push({ moderatorId, minutes, reason, at: new Date().toISOString() });
  writeRecords(records);
  return record;
}

function moderationSummaryEmbed(member, record) {
  const latestWarning = record.warnings.at(-1);
  const latestMute = record.mutes.at(-1);

  const embed = new EmbedBuilder()
    .setColor(colors.danger)
    .setTitle("moderation record")
    .setDescription(`${member.user.tag} (${member.id})`)
    .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
    .addFields(
      { name: "warnings", value: `${record.warnings.length}`, inline: true },
      { name: "past mutes", value: `${record.mutes.length}`, inline: true }
    )
    .setTimestamp();

  if (latestWarning) {
    embed.addFields({
      name: "latest warning",
      value: `${latestWarning.reason}\nmoderator: <@${latestWarning.moderatorId}>`
    });
  }

  if (latestMute) {
    embed.addFields({
      name: "latest mute",
      value: `${latestMute.minutes} minute(s)\n${latestMute.reason}\nmoderator: <@${latestMute.moderatorId}>`
    });
  }

  return embed;
}

module.exports = {
  addMute,
  addWarning,
  moderationSummaryEmbed
};
