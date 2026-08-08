const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("recommend")
    .setDescription("Recommend a game, album, artist, playlist, or track.")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Recommendation type")
        .setRequired(true)
        .addChoices(
          { name: "Game", value: "Game" },
          { name: "Album", value: "Album" },
          { name: "Artist", value: "Artist" },
          { name: "Playlist", value: "Playlist" },
          { name: "Track", value: "Track" }
        )
    )
    .addStringOption((option) => option.setName("title").setDescription("Title or name").setRequired(true))
    .addStringOption((option) => option.setName("why").setDescription("Why people should check it out"))
    .addStringOption((option) => option.setName("link").setDescription("Optional URL")),
  async execute(interaction, client) {
    const type = interaction.options.getString("type", true);
    const title = interaction.options.getString("title", true);
    const why = interaction.options.getString("why") || "No notes, just vibes.";
    const link = interaction.options.getString("link");

    const embed = baseEmbed(client, { color: colors.brand })
      .setTitle(`${type} recommendation: ${title}`)
      .setDescription(why)
      .addFields({ name: "Shared by", value: `${interaction.user}`, inline: true });

    if (link) embed.addFields({ name: "Link", value: link });
    await interaction.reply({ embeds: [embed] });
  }
};
