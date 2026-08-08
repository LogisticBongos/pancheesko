const { PermissionFlagsBits } = require("discord.js");
const { colors } = require("./embeds");
const { logModeration } = require("./logging");

function canModerateMember(actor, target) {
  if (!target || !actor) return false;
  if (target.id === target.guild.ownerId) return false;
  if (actor.id === target.guild.ownerId) return true;
  return actor.roles.highest.comparePositionTo(target.roles.highest) > 0;
}

function canBotModerate(target) {
  const botMember = target.guild.members.me;
  if (!botMember) return false;
  if (target.id === target.guild.ownerId) return false;
  return botMember.roles.highest.comparePositionTo(target.roles.highest) > 0;
}

async function safeBanMinus15(member, client, trigger = "role check") {
  const { autoBan } = client.config;
  if (!autoBan.minus15RoleId) return { action: "skipped", reason: "AUTO_BAN_MINUS15_ROLE_ID is not configured." };
  if (!member.roles.cache.has(autoBan.minus15RoleId)) return { action: "skipped", reason: "Member does not have configured role." };

  const role = member.guild.roles.cache.get(autoBan.minus15RoleId);
  if (!role) return { action: "skipped", reason: "Configured role was not found in this guild." };
  if (role.name !== autoBan.minus15RoleName) {
    return { action: "skipped", reason: `Configured role name is "${role.name}", expected "${autoBan.minus15RoleName}".` };
  }
  if (member.user.bot) return { action: "skipped", reason: "Bots are not auto-banned." };
  if (member.permissions.has(PermissionFlagsBits.Administrator) || member.permissions.has(PermissionFlagsBits.ManageGuild)) {
    return { action: "skipped", reason: "Member has elevated server permissions." };
  }
  if (!canBotModerate(member)) return { action: "skipped", reason: "Bot role is not high enough to ban this member." };

  const reason = `${autoBan.reason} Trigger: ${trigger}`;
  if (autoBan.dryRun) {
    await logModeration(
      client,
      member.guild,
      "Auto-ban dry run",
      `${member.user.tag} (${member.id}) has ${role.name}, but AUTO_BAN_DRY_RUN is enabled.`,
      colors.danger
    );
    return { action: "dry-run", reason };
  }

  await member.ban({ reason });
  await logModeration(
    client,
    member.guild,
    "Auto-banned member",
    `${member.user.tag} (${member.id}) was banned because they had ${role.name}.\nReason: ${reason}`,
    colors.danger
  );
  return { action: "banned", reason };
}

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours} hour${hours === 1 ? "" : "s"}`;
}

module.exports = {
  canBotModerate,
  canModerateMember,
  formatDuration,
  safeBanMinus15
};
