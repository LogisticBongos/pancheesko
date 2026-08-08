const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { colors } = require("../../utils/embeds");
const { logModeration } = require("../../utils/logging");
const { canBotModerate, canModerateMember } = require("../../utils/moderation");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) => option.setName("member").setDescription("Member to ban").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Reason"))
    .addIntegerOption((option) => option.setName("delete_days").setDescription("Message history days to delete").setMinValue(0).setMaxValue(7)),
  async execute(interaction, client) {
    const member = interaction.options.getMember("member");
    const reason = interaction.options.getString("reason") || "No reason provided.";
    const deleteMessageSeconds = (interaction.options.getInteger("delete_days") || 0) * 86400;

    if (!member) return interaction.reply({ content: "That member is not in this server.", ephemeral: true });
    if (!canModerateMember(interaction.member, member)) return interaction.reply({ content: "You cannot ban that member.", ephemeral: true });
    if (!canBotModerate(member)) return interaction.reply({ content: "My role is not high enough to ban that member.", ephemeral: true });

    await member.ban({ reason: `${reason} Moderator: ${interaction.user.tag}`, deleteMessageSeconds });
    await logModeration(client, interaction.guild, "Member banned", `${member.user.tag} (${member.id})\nModerator: ${interaction.user.tag}\nReason: ${reason}`, colors.danger);
    await interaction.reply({ content: `${member.user.tag} was banned.`, ephemeral: true });
  }
};
