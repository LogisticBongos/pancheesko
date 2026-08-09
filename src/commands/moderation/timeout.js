const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { colors } = require("../../utils/embeds");
const { logModeration, sendToChannel } = require("../../utils/logging");
const { canBotModerate, canModerateMember, formatDuration } = require("../../utils/moderation");
const { addMute, moderationSummaryEmbed } = require("../../utils/moderationRecords");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("timeout a member.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) => option.setName("member").setDescription("member to timeout").setRequired(true))
    .addIntegerOption((option) => option.setName("minutes").setDescription("timeout length in minutes").setRequired(true).setMinValue(1).setMaxValue(40320))
    .addStringOption((option) => option.setName("reason").setDescription("reason")),
  async execute(interaction, client) {
    const member = interaction.options.getMember("member");
    const minutes = interaction.options.getInteger("minutes", true);
    const reason = interaction.options.getString("reason") || "no reason provided.";

    if (!member) return interaction.reply({ content: "that member is not in this server.", ephemeral: true });
    if (!canModerateMember(interaction.member, member)) return interaction.reply({ content: "you cannot timeout that member.", ephemeral: true });
    if (!canBotModerate(member)) return interaction.reply({ content: "my role is not high enough to timeout that member.", ephemeral: true });

    await member.timeout(minutes * 60_000, `${reason} moderator: ${interaction.user.tag}`);
    const record = addMute(interaction.guild.id, member.id, interaction.user.id, minutes, reason);
    await logModeration(client, interaction.guild, "member timed out", `${member.user.tag} (${member.id}) for ${formatDuration(minutes)}\nmoderator: ${interaction.user.tag}\nreason: ${reason}`, colors.danger);
    await sendToChannel(client, client.config.channels.memberLog, {
      embeds: [moderationSummaryEmbed(member, record)]
    });
    await interaction.reply({ content: `${member.user.tag} was timed out for ${formatDuration(minutes)}.`, ephemeral: true });
  }
};
