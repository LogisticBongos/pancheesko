const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { colors } = require("../../utils/embeds");
const { logModeration } = require("../../utils/logging");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user by ID.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((option) => option.setName("user_id").setDescription("User ID to unban").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Reason")),
  async execute(interaction, client) {
    const userId = interaction.options.getString("user_id", true);
    const reason = interaction.options.getString("reason") || "No reason provided.";
    await interaction.guild.members.unban(userId, `${reason} Moderator: ${interaction.user.tag}`);
    await logModeration(client, interaction.guild, "User unbanned", `${userId}\nModerator: ${interaction.user.tag}\nReason: ${reason}`, colors.success);
    await interaction.reply({ content: `Unbanned ${userId}.`, ephemeral: true });
  }
};
