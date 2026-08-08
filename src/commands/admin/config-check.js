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

    const embed = baseEmbed(client, { color: colors.info })
      .setTitle("Pancheesko config check")
      .addFields(
        { name: "Channels", value: channelStatus || "None" },
        { name: "Button role sets", value: `${client.config.roles.buttonSets.length}`, inline: true },
        { name: "Select menus", value: `${client.config.roles.selectMenus.length}`, inline: true },
        { name: "Reaction roles", value: `${client.config.roles.reactionSets.length}`, inline: true },
        { name: "Minus-15 auto-ban", value: client.config.autoBan.minus15RoleId ? `Configured${client.config.autoBan.dryRun ? " (dry run)" : ""}` : "Missing role ID", inline: true }
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
