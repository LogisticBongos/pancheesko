const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embeds");

const commandGroups = [
  {
    name: "general",
    value: [
      "`/server` - shows a quick server summary.",
      "`/user` - shows join date, account age, and roles.",
      "`/avatar` - grabs someone's avatar.",
      "`/links` - shows the links that have been added in config.",
      "`/commands` - this list."
    ].join("\n")
  },
  {
    name: "community",
    value: [
      "`/poll` - make a quick reaction poll.",
      "`/event` - post a simple event card."
    ].join("\n")
  },
  {
    name: "setup",
    value: [
      "`/setup onboarding` - posts the verify and intro messages.",
      "`/setup game-roles` - posts the game role menu.",
      "`/setup colour-roles` - posts the colour role menu.",
      "`/setup activity-roles` - posts the activity ping role menu.",
      "`/setup platform-roles` - posts the pc/console role menu.",
      "`/setup member-counters` - creates the member count voice channels.",
      "`/test-welcome` - sends a test welcome message to a channel.",
      "`/response` - makes, lists, and removes trigger replies.",
      "`/config-check` - checks what ids are set in `.env`.",
      "`/scan-minus15` - previews or runs the minus-15 role ban scan."
    ].join("\n")
  },
  {
    name: "mod tools",
    value: [
      "`/ban` - bans someone.",
      "`/bans` - lists banned users and how pancheesko handled them.",
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
    .setDescription("show the command list."),
  async execute(interaction, client) {
    const embed = baseEmbed(client, { color: colors.info })
      .setTitle("command list")
      .addFields(commandGroups);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
