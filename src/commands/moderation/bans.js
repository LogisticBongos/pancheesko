const { AuditLogEvent, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embeds");
const { guildRecords } = require("../../utils/moderationRecords");

function formatDate(value) {
  if (!value) return "unknown date";

  const time = Math.floor(new Date(value).getTime() / 1000);
  if (!Number.isFinite(time)) return "unknown date";

  return `<t:${time}:f>`;
}

function latestBanRecord(records, userId) {
  const bans = records[userId]?.bans || [];
  return bans.at(-1);
}

function commandBanFromReason(reason) {
  if (!reason) return null;

  const match = reason.match(/^(?<reason>.*)\s+moderator:\s+(?<moderator>.+)$/i);
  if (!match?.groups) return null;

  return {
    moderator: match.groups.moderator,
    reason: match.groups.reason || "no reason recorded."
  };
}

async function banAuditEntries(guild) {
  try {
    const logs = await guild.fetchAuditLogs({
      limit: 100,
      type: AuditLogEvent.MemberBanAdd
    });

    return new Map(logs.entries.map((entry) => [entry.target?.id, entry]));
  } catch {
    return new Map();
  }
}

function banField(ban, record, auditEntry, botId) {
  const userLabel = `${ban.user.tag || ban.user.username} (${ban.user.id})`;
  const reasonRecord = commandBanFromReason(ban.reason);
  const auditSaysBot = auditEntry?.executorId === botId;

  if (!record) {
    if (reasonRecord || auditSaysBot) {
      const lines = [
        "banned with pancheesko.",
        `reason: ${reasonRecord?.reason || ban.reason || "no reason recorded."}`,
        `moderator: ${reasonRecord?.moderator || "unknown"}`,
        "source: discord ban list"
      ];

      return {
        name: userLabel,
        value: lines.join("\n").slice(0, 1024)
      };
    }

    const discordReason = ban.reason ? `\ndiscord reason: ${ban.reason}` : "";
    return {
      name: userLabel,
      value: `not banned with pancheesko.${discordReason}`.slice(0, 1024)
    };
  }

  const moderator = record.moderatorId ? `<@${record.moderatorId}>` : "unknown";
  const lines = [
    `banned with pancheesko (${record.source || "command"}).`,
    `reason: ${record.reason || "no reason recorded."}`,
    `moderator: ${moderator}`,
    `dm sent: ${record.dmSent ? "yes" : "no"}`,
    `when: ${formatDate(record.at)}`
  ];

  return {
    name: userLabel,
    value: lines.join("\n").slice(0, 1024)
  };
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bans")
    .setDescription("show banned members and whether pancheesko banned them.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption((option) =>
      option
        .setName("page")
        .setDescription("which page to show")
        .setMinValue(1)
    ),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({ content: "admin only.", ephemeral: true });
      return;
    }

    await interaction.deferReply();

    const pageSize = 10;
    const requestedPage = interaction.options.getInteger("page") || 1;
    const bans = [...(await interaction.guild.bans.fetch()).values()];
    const auditEntries = await banAuditEntries(interaction.guild);
    const records = guildRecords(interaction.guild.id);
    const pages = Math.max(1, Math.ceil(bans.length / pageSize));
    const page = Math.min(requestedPage, pages);
    const pageBans = bans.slice((page - 1) * pageSize, page * pageSize);

    const embed = baseEmbed(client, { color: colors.danger })
      .setTitle("banned members")
      .setDescription(bans.length ? `page ${page}/${pages}. total bans: ${bans.length}.` : "no banned members found.");

    if (pageBans.length) {
      embed.addFields(pageBans.map((ban) => banField(
        ban,
        latestBanRecord(records, ban.user.id),
        auditEntries.get(ban.user.id),
        client.user.id
      )));
    }

    await interaction.editReply({ embeds: [embed] });
  }
};
