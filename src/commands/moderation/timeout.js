const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { colors } = require("../../utils/embeds");
const { logModeration } = require("../../utils/logging");
const { canBotModerate, canModerateMember, formatDuration } = require("../../utils/moderation");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a member.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) => option.setName("member").setDescription("Member to timeout").setRequired(true))
    .addIntegerOption((option) => option.setName("minutes").setDescription("Timeout length in minutes").setRequired(true).setMinValue(1).setMaxValue(40320))
    .addStringOption((option) => option.setName("reason").setDescription("Reason")),
  async execute(interaction, client) {
    const member = interaction.options.getMember("member");
    const minutes = interaction.options.getInteger("minutes", true);
    const reason = interaction.options.getString("reason") || "No reason provided.";

    if (!member) return interaction.reply({ content: "That member is not in this server.", ephemeral: true });
    if (!canModerateMember(interaction.member, member)) return interaction.reply({ content: "You cannot timeout that member.", ephemeral: true });
    if (!canBotModerate(member)) return interaction.reply({ content: "My role is not high enough to timeout that member.", ephemeral: true });

    await member.timeout(minutes * 60_000, `${reason} Moderator: ${interaction.user.tag}`);
    await logModeration(client, interaction.guild, "Member timed out", `${member.user.tag} (${member.id}) for ${formatDuration(minutes)}\nModerator: ${interaction.user.tag}\nReason: ${reason}`, colors.danger);
    await interaction.reply({ content: `${member.user.tag} was timed out for ${formatDuration(minutes)}.`, ephemeral: true });
  }
};
