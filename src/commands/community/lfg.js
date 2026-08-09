const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lfg")
    .setDescription("Post a looking-for-group card.")
    .addStringOption((option) => option.setName("game").setDescription("Game or activity").setRequired(true))
    .addStringOption((option) => option.setName("when").setDescription("When you want to play").setRequired(true))
    .addIntegerOption((option) => option.setName("spots").setDescription("Open spots").setMinValue(1).setMaxValue(99))
    .addStringOption((option) => option.setName("notes").setDescription("Extra details")),
  async execute(interaction, client) {
    const game = interaction.options.getString("game", true);
    const when = interaction.options.getString("when", true);
    const spots = interaction.options.getInteger("spots");
    const notes = interaction.options.getString("notes");

    const embed = baseEmbed(client, { color: colors.success })
      .setTitle(`lfg: ${game}`)
      .setDescription(notes || "React or reply if you want in.")
      .addFields(
        { name: "when", value: when, inline: true },
        { name: "host", value: `${interaction.user}`, inline: true }
      );

    if (spots) embed.addFields({ name: "open spots", value: `${spots}`, inline: true });
    await interaction.reply({ embeds: [embed] });
  }
};
