const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { colors } = require("../../utils/embeds");
const { logModeration } = require("../../utils/logging");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Bulk-delete recent messages.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) => option.setName("amount").setDescription("Messages to delete").setRequired(true).setMinValue(1).setMaxValue(100)),
  async execute(interaction, client) {
    const amount = interaction.options.getInteger("amount", true);
    await interaction.deferReply({ ephemeral: true });
    const deleted = await interaction.channel.bulkDelete(amount, true);
    await logModeration(client, interaction.guild, "Messages purged", `${deleted.size} messages deleted in ${interaction.channel} by ${interaction.user.tag}.`, colors.danger);
    await interaction.editReply(`Deleted ${deleted.size} message${deleted.size === 1 ? "" : "s"}.`);
  }
};
