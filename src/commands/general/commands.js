const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embeds");

const commandGroups = [
  {
    name: "getting around",
    value: [
      "`/ping` - checks if i am awake.",
      "`/server` - shows a quick server summary.",
      "`/user` - shows join date, account age, and roles.",
      "`/avatar` - grabs someone's avatar.",
      "`/links` - shows the links that have been added in config.",
      "`/commands` - this list."
    ].join("\n")
  },
  {
    name: "community stuff",
    value: [
      "`/lfg` - make a looking-for-group post.",
      "`/recommend` - share a game, song, album, artist, or playlist.",
      "`/poll` - make a quick reaction poll.",
      "`/event` - post a simple event card."
    ].join("\n")
  },
  {
    name: "setup",
    value: [
      "`/setup onboarding` - posts the verify and intro messages.",
      "`/setup roles` - posts the game and color role menus.",
      "`/config-check` - checks what ids are set in `.env`.",
      "`/scan-minus15` - previews or runs the minus-15 role ban scan."
    ].join("\n")
  },
  {
    name: "mod tools",
    value: [
      "`/ban` - bans someone.",
      "`/kick` - kicks someone.",
      "`/timeout` - times someone out.",
      "`/untimeout` - removes a timeout.",
      "`/warn` - logs a warning.",
      "`/purge` - clears recent messages.",
      "`/slowmode` - changes slowmode in the channel.",
      "`/unban` - unbans someone by user id."
    ].join("\n")
  }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("commands")
    .setDescription("show what i can do, without making it weird."),
  async execute(interaction, client) {
    const embed = baseEmbed(client, { color: colors.info })
      .setTitle("commands")
      .setDescription("here is the short version.")
      .addFields(commandGroups);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
