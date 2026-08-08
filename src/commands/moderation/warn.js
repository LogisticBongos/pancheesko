const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { colors } = require("../../utils/embeds");
const { logModeration } = require("../../utils/logging");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Log a warning for a member.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) => option.setName("member").setDescription("Member to warn").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Warning reason").setRequired(true)),
  async execute(interaction, client) {
    const member = interaction.options.getMember("member");
    const reason = interaction.options.getString("reason", true);
    if (!member) return interaction.reply({ content: "That member is not in this server.", ephemeral: true });

    await logModeration(client, interaction.guild, "Member warned", `${member.user.tag} (${member.id})\nModerator: ${interaction.user.tag}\nReason: ${reason}`, colors.danger);
    await interaction.reply({ content: `${member.user.tag} was warned and the warning was logged.`, ephemeral: true });
  }
};
