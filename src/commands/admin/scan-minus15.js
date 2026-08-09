const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embeds");
const { safeBanMinus15 } = require("../../utils/moderation");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("scan-minus15")
    .setDescription("Find members with the configured -15 role and optionally ban them.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addBooleanOption((option) =>
      option
        .setName("execute")
        .setDescription("Actually ban matching members. False previews only.")
    ),
  async execute(interaction, client) {
    const roleId = client.config.autoBan.minus15RoleId;
    const shouldExecute = interaction.options.getBoolean("execute") === true;

    if (!roleId) {
      await interaction.reply({ content: "auto ban minus-15 role id is not configured.", ephemeral: true });
      return;
    }

    await interaction.deferReply({ ephemeral: true });
    const members = await interaction.guild.members.fetch();
    const flaggedMembers = [...members.filter((member) => member.roles.cache.has(roleId)).values()];

    if (!shouldExecute) {
      const embed = baseEmbed(client, { color: colors.info })
        .setTitle("minus-15 scan preview")
        .setDescription(flaggedMembers.length ? flaggedMembers.map((member) => `${member.user.tag} (${member.id})`).slice(0, 20).join("\n") : "no matching members found.")
        .addFields({ name: "matches", value: `${flaggedMembers.length}`, inline: true });
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const results = [];
    for (const member of flaggedMembers) {
      const result = await safeBanMinus15(member, client, "manual scan");
      results.push(`${member.user.tag}: ${result.action} (${result.reason})`);
    }

    const embed = baseEmbed(client, { color: colors.danger })
      .setTitle("minus-15 scan complete")
      .setDescription(results.slice(0, 20).join("\n") || "no matching members found.")
      .addFields({ name: "checked", value: `${flaggedMembers.length}`, inline: true });

    await interaction.editReply({ embeds: [embed] });
  }
};
