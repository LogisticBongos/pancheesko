const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("event")
    .setDescription("Announce a community event.")
    .addStringOption((option) => option.setName("title").setDescription("Event title").setRequired(true))
    .addStringOption((option) => option.setName("when").setDescription("Date/time").setRequired(true))
    .addStringOption((option) => option.setName("details").setDescription("Details").setRequired(true)),
  async execute(interaction, client) {
    const title = interaction.options.getString("title", true);
    const when = interaction.options.getString("when", true);
    const details = interaction.options.getString("details", true);

    const embed = baseEmbed(client, { color: colors.success })
      .setTitle(title)
      .setDescription(details)
      .addFields(
        { name: "when", value: when, inline: true },
        { name: "host", value: `${interaction.user}`, inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  }
};
