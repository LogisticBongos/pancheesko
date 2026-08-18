const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embeds");
const { guildResponses, normaliseTrigger, removeResponse, removeResponseText, responseList, setResponse } = require("../../utils/responses");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("response")
    .setDescription("manage automatic trigger responses.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("add a possible reply for a trigger.")
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
        .setDescription("remove a saved response.")
        .addStringOption((option) =>
          option
            .setName("response")
            .setDescription("exact response text to remove")
            .setRequired(true)
            .setMaxLength(1800)
        )
        .addStringOption((option) =>
          option
            .setName("trigger")
            .setDescription("optional trigger to remove it from")
            .setMaxLength(80)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove-trigger")
        .setDescription("remove a trigger and all of its responses.")
        .addStringOption((option) =>
          option
            .setName("trigger")
            .setDescription("trigger to remove")
            .setRequired(true)
            .setMaxLength(80)
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

      const count = setResponse(interaction.guild.id, trigger, response, interaction.user.id);
      await interaction.editReply(`saved response for \`${normaliseTrigger(trigger)}\` (${count} total).`);
      return;
    }

    if (subcommand === "remove") {
      const response = interaction.options.getString("response", true);
      const trigger = interaction.options.getString("trigger");
      const result = removeResponseText(interaction.guild.id, response, trigger);

      if (!result.removed) {
        await interaction.editReply("could not find that exact response.");
        return;
      }

      await interaction.editReply(`removed ${result.removed} response${result.removed === 1 ? "" : "s"} from: ${result.triggers.map((item) => `\`${item}\``).join(", ")}.`);
      return;
    }

    if (subcommand === "remove-trigger") {
      const trigger = interaction.options.getString("trigger", true);
      const removed = removeResponse(interaction.guild.id, trigger);

      await interaction.editReply(removed ? `removed \`${normaliseTrigger(trigger)}\`.` : `could not find \`${normaliseTrigger(trigger)}\`.`);
      return;
    }

    const responses = guildResponses(interaction.guild.id);
    const lines = Object.entries(responses).map(([trigger, entry]) => {
      const options = responseList(entry);
      const preview = options[0]?.slice(0, 80) || "empty response";
      const label = options.length === 1 ? "1 reply" : `${options.length} replies`;
      return `\`${trigger}\` -> ${label} (${preview})`;
    });

    const embed = baseEmbed(client, { color: colors.info })
      .setTitle("responses")
      .setDescription(lines.length ? lines.join("\n") : "no responses set yet.");

    await interaction.editReply({ embeds: [embed] });
  }
};
