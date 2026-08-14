const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { colors } = require("../../utils/embeds");
const { logModeration } = require("../../utils/logging");
const { canBotModerate, canModerateMember, sendBanDm } = require("../../utils/moderation");
const { addBan } = require("../../utils/moderationRecords");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("ban a member.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) => option.setName("member").setDescription("member to ban").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("reason"))
    .addIntegerOption((option) => option.setName("delete_days").setDescription("message history days to delete").setMinValue(0).setMaxValue(7)),
  async execute(interaction, client) {
    const member = interaction.options.getMember("member");
    const reason = interaction.options.getString("reason") || "no reason provided.";
    const deleteMessageSeconds = (interaction.options.getInteger("delete_days") || 0) * 86400;

    if (!member) return interaction.reply({ content: "that member is not in this server.", ephemeral: true });
    if (!canModerateMember(interaction.member, member)) return interaction.reply({ content: "you cannot ban that member.", ephemeral: true });
    if (!canBotModerate(member)) return interaction.reply({ content: "my role is not high enough to ban that member.", ephemeral: true });

    const dmSent = await sendBanDm(member, reason);
    await member.ban({ reason: `${reason} moderator: ${interaction.user.tag}`, deleteMessageSeconds });
    addBan(interaction.guild.id, member.id, interaction.user.id, reason, { dmSent, source: "command" });
    await logModeration(client, interaction.guild, "member banned", `${member.user.tag} (${member.id})\nmoderator: ${interaction.user.tag}\nreason: ${reason}\ndm sent: ${dmSent ? "yes" : "no"}`, colors.danger);
    await interaction.reply({ content: `${member.user.tag} was banned. dm sent: ${dmSent ? "yes" : "no"}.`, ephemeral: true });
  }
};
