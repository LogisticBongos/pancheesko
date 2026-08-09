const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { colors } = require("../../utils/embeds");
const { logModeration } = require("../../utils/logging");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("set channel slowmode.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addIntegerOption((option) => option.setName("seconds").setDescription("slowmode seconds").setRequired(true).setMinValue(0).setMaxValue(21600)),
  async execute(interaction, client) {
    const seconds = interaction.options.getInteger("seconds", true);
    await interaction.channel.setRateLimitPerUser(seconds, `slowmode updated by ${interaction.user.tag}`);
    await logModeration(client, interaction.guild, "slowmode updated", `${interaction.channel} slowmode set to ${seconds}s by ${interaction.user.tag}.`, colors.info);
    await interaction.reply({ content: `slowmode is now ${seconds}s.`, ephemeral: true });
  }
};
