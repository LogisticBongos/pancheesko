const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { colors } = require("../../utils/embeds");
const { logModeration } = require("../../utils/logging");
const { canBotModerate, canModerateMember } = require("../../utils/moderation");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("untimeout")
    .setDescription("Remove a timeout from a member.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) => option.setName("member").setDescription("Member to restore").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Reason")),
  async execute(interaction, client) {
    const member = interaction.options.getMember("member");
    const reason = interaction.options.getString("reason") || "No reason provided.";

    if (!member) return interaction.reply({ content: "That member is not in this server.", ephemeral: true });
    if (!canModerateMember(interaction.member, member)) return interaction.reply({ content: "You cannot moderate that member.", ephemeral: true });
    if (!canBotModerate(member)) return interaction.reply({ content: "My role is not high enough to update that member.", ephemeral: true });

    await member.timeout(null, `${reason} Moderator: ${interaction.user.tag}`);
    await logModeration(client, interaction.guild, "Timeout removed", `${member.user.tag} (${member.id})\nModerator: ${interaction.user.tag}\nReason: ${reason}`, colors.success);
    await interaction.reply({ content: `${member.user.tag}'s timeout was removed.`, ephemeral: true });
  }
};
