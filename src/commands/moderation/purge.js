const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { colors } = require("../../utils/embeds");
const { logModeration } = require("../../utils/logging");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("bulk-delete recent messages.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) => option.setName("amount").setDescription("messages to delete").setRequired(true).setMinValue(1).setMaxValue(2000)),
  async execute(interaction, client) {
    const amount = interaction.options.getInteger("amount", true);
    await interaction.deferReply({ ephemeral: true });

    let remaining = amount;
    let deletedCount = 0;

    while (remaining > 0) {
      const messages = await interaction.channel.messages.fetch({ limit: Math.min(remaining, 100) });
      if (!messages.size) break;

      const deleted = await interaction.channel.bulkDelete(messages, true);
      deletedCount += deleted.size;
      remaining -= messages.size;

      if (!deleted.size) break;
    }

    await logModeration(client, interaction.guild, "messages purged", `${deletedCount}/${amount} messages deleted in ${interaction.channel} by ${interaction.user.tag}.`, colors.danger);
    await interaction.editReply(`deleted ${deletedCount} message${deletedCount === 1 ? "" : "s"}.${deletedCount < amount ? " some messages may have been too old to delete." : ""}`);
  }
};
