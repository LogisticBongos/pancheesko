const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config-check")
    .setDescription("Show which optional bot features are configured.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction, client) {
    const channelStatus = Object.entries(client.config.channels)
      .map(([name, value]) => `${value ? "OK" : "Missing"} ${name}`)
      .join("\n");

    const gameRoles = client.config.roleGroups.games.filter((role) => role.roleId).length;
    const colorRoles = client.config.roleGroups.colors.filter((role) => role.roleId).length;

    const embed = baseEmbed(client, { color: colors.info })
      .setTitle("Pancheesko config check")
      .addFields(
        { name: "Channels", value: channelStatus || "None" },
        { name: "Member role", value: client.config.onboarding.memberRoleId ? "Configured" : "Missing", inline: true },
        { name: "Unverified role", value: client.config.onboarding.unverifiedRoleId ? "Configured" : "Optional / missing", inline: true },
        { name: "Game roles", value: `${gameRoles}`, inline: true },
        { name: "Color roles", value: `${colorRoles}`, inline: true },
        { name: "Minus-15 auto-ban", value: client.config.autoBan.minus15RoleId ? `Configured${client.config.autoBan.dryRun ? " (dry run)" : ""}` : "Missing role ID", inline: true }
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
