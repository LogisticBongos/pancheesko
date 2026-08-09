const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { colors } = require("../../utils/embeds");
const { logModeration } = require("../../utils/logging");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("unban a user by id.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((option) => option.setName("user_id").setDescription("user id to unban").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("reason")),
  async execute(interaction, client) {
    const userId = interaction.options.getString("user_id", true);
    const reason = interaction.options.getString("reason") || "no reason provided.";
    await interaction.guild.members.unban(userId, `${reason} moderator: ${interaction.user.tag}`);
    await logModeration(client, interaction.guild, "user unbanned", `${userId}\nmoderator: ${interaction.user.tag}\nreason: ${reason}`, colors.success);
    await interaction.reply({ content: `unbanned ${userId}.`, ephemeral: true });
  }
};
