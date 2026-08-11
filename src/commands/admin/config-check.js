const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config-check")
    .setDescription("show which optional bot features are set up.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction, client) {
    const channelStatus = Object.entries(client.config.channels)
      .map(([name, value]) => `${value ? "set" : "missing"} ${name}`)
      .join("\n");

    const gameRoles = client.config.roleGroups.games.filter((role) => role.roleId).length;
    const colorRoles = client.config.roleGroups.colors.filter((role) => role.roleId).length;
    const activityRoles = client.config.roleGroups.activities.filter((role) => role.roleId).length;

    const embed = baseEmbed(client, { color: colors.info })
      .setTitle("pancheesko config check")
      .addFields(
        { name: "channels", value: channelStatus || "none" },
        { name: "member role", value: client.config.onboarding.memberRoleId ? "set" : "missing", inline: true },
        { name: "unverified role", value: client.config.onboarding.unverifiedRoleId ? "set" : "optional / missing", inline: true },
        { name: "member counters", value: client.config.channels.memberCount && client.config.channels.humanCount ? "set" : "missing", inline: true },
        { name: "game roles", value: `${gameRoles}`, inline: true },
        { name: "colour roles", value: `${colorRoles}`, inline: true },
        { name: "activity roles", value: `${activityRoles}`, inline: true },
        { name: "minus-15 auto-ban", value: client.config.autoBan.minus15RoleId ? `set${client.config.autoBan.dryRun ? " (dry run)" : ""}` : "missing role id", inline: true }
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
