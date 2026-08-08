const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { colors } = require("../../utils/embeds");
const { logModeration } = require("../../utils/logging");
const { canBotModerate, canModerateMember } = require("../../utils/moderation");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) => option.setName("member").setDescription("Member to kick").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Reason")),
  async execute(interaction, client) {
    const member = interaction.options.getMember("member");
    const reason = interaction.options.getString("reason") || "No reason provided.";

    if (!member) return interaction.reply({ content: "That member is not in this server.", ephemeral: true });
    if (!canModerateMember(interaction.member, member)) return interaction.reply({ content: "You cannot kick that member.", ephemeral: true });
    if (!canBotModerate(member)) return interaction.reply({ content: "My role is not high enough to kick that member.", ephemeral: true });

    await member.kick(`${reason} Moderator: ${interaction.user.tag}`);
    await logModeration(client, interaction.guild, "Member kicked", `${member.user.tag} (${member.id})\nModerator: ${interaction.user.tag}\nReason: ${reason}`, colors.danger);
    await interaction.reply({ content: `${member.user.tag} was kicked.`, ephemeral: true });
  }
};
