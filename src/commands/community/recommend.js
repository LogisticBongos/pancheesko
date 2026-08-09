const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("recommend")
    .setDescription("recommend a game, album, artist, playlist, or track.")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("recommendation type")
        .setRequired(true)
        .addChoices(
          { name: "game", value: "game" },
          { name: "album", value: "album" },
          { name: "artist", value: "artist" },
          { name: "playlist", value: "playlist" },
          { name: "track", value: "track" }
        )
    )
    .addStringOption((option) => option.setName("title").setDescription("title or name").setRequired(true))
    .addStringOption((option) => option.setName("why").setDescription("why people should check it out"))
    .addStringOption((option) => option.setName("link").setDescription("optional link")),
  async execute(interaction, client) {
    const type = interaction.options.getString("type", true);
    const title = interaction.options.getString("title", true);
    const why = interaction.options.getString("why") || "no notes, just vibes.";
    const link = interaction.options.getString("link");

    const embed = baseEmbed(client, { color: colors.brand })
      .setTitle(`${type} recommendation: ${title}`)
      .setDescription(why)
      .addFields({ name: "shared by", value: `${interaction.user}`, inline: true });

    if (link) embed.addFields({ name: "link", value: link });
    await interaction.reply({ embeds: [embed] });
  }
};
