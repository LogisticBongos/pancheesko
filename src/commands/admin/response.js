const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embeds");
const { guildResponses, normaliseTrigger, removeResponse, setResponse } = require("../../utils/responses");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("response")
    .setDescription("manage automatic trigger responses.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("add or update a trigger response.")
        .addStringOption((option) =>
          option
            .setName("trigger")
            .setDescription("word or phrase that makes the bot respond")
            .setRequired(true)
            .setMaxLength(80)
        )
        .addStringOption((option) =>
          option
            .setName("response")
            .setDescription("what the bot should say")
            .setRequired(true)
            .setMaxLength(1800)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("remove a trigger response.")
        .addStringOption((option) =>
          option
            .setName("trigger")
            .setDescription("trigger to remove")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("list trigger responses.")
  ),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "add") {
      const trigger = interaction.options.getString("trigger", true);
      const response = interaction.options.getString("response", true);

      setResponse(interaction.guild.id, trigger, response, interaction.user.id);
      await interaction.editReply(`saved response for \`${normaliseTrigger(trigger)}\`.`);
      return;
    }

    if (subcommand === "remove") {
      const trigger = interaction.options.getString("trigger", true);
      const removed = removeResponse(interaction.guild.id, trigger);

      await interaction.editReply(removed ? `removed \`${normaliseTrigger(trigger)}\`.` : `could not find \`${normaliseTrigger(trigger)}\`.`);
      return;
    }

    const responses = guildResponses(interaction.guild.id);
    const lines = Object.entries(responses).map(([trigger, entry]) => {
      return `\`${trigger}\` -> ${entry.response.slice(0, 80)}`;
    });

    const embed = baseEmbed(client, { color: colors.info })
      .setTitle("responses")
      .setDescription(lines.length ? lines.join("\n") : "no responses set yet.");

    await interaction.editReply({ embeds: [embed] });
  }
};
