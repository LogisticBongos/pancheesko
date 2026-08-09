const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { colors } = require("../../utils/embeds");
const { logModeration } = require("../../utils/logging");
const { canBotModerate, canModerateMember } = require("../../utils/moderation");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("kick a member.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) => option.setName("member").setDescription("member to kick").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("reason")),
  async execute(interaction, client) {
    const member = interaction.options.getMember("member");
    const reason = interaction.options.getString("reason") || "no reason provided.";

    if (!member) return interaction.reply({ content: "that member is not in this server.", ephemeral: true });
    if (!canModerateMember(interaction.member, member)) return interaction.reply({ content: "you cannot kick that member.", ephemeral: true });
    if (!canBotModerate(member)) return interaction.reply({ content: "my role is not high enough to kick that member.", ephemeral: true });

    await member.kick(`${reason} moderator: ${interaction.user.tag}`);
    await logModeration(client, interaction.guild, "member kicked", `${member.user.tag} (${member.id})\nmoderator: ${interaction.user.tag}\nreason: ${reason}`, colors.danger);
    await interaction.reply({ content: `${member.user.tag} was kicked.`, ephemeral: true });
  }
};
