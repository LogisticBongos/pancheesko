const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Show a user's avatar.")
    .addUserOption((option) => option.setName("user").setDescription("user to show")),
  async execute(interaction, client) {
    const user = interaction.options.getUser("user") || interaction.user;
    const url = user.displayAvatarURL({ size: 1024 });
    const embed = baseEmbed(client, { color: colors.info })
      .setTitle(`${user.username}'s avatar`)
      .setImage(url);

    await interaction.reply({ embeds: [embed] });
  }
};
