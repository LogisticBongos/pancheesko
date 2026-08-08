const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embeds");

const labels = {
  website: "Website",
  twitch: "Twitch",
  youtube: "YouTube",
  spotify: "Spotify",
  soundcloud: "SoundCloud",
  steam: "Steam group"
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("links")
    .setDescription("Show useful community links."),
  async execute(interaction, client) {
    const lines = Object.entries(client.config.links)
      .filter(([, url]) => url)
      .map(([key, url]) => `[${labels[key]}](${url})`);

    const embed = baseEmbed(client, { color: colors.brand })
      .setTitle(`${client.config.communityName} links`)
      .setDescription(lines.length ? lines.join("\n") : "No community links are configured yet.");

    await interaction.reply({ embeds: [embed], ephemeral: lines.length === 0 });
  }
};
