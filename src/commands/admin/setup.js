const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors, introductionEmbed } = require("../../utils/embeds");
const { buildButtonRoleRows, buildSelectRoleRows } = require("../../utils/roles");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Post configured community setup messages.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("welcome")
        .setDescription("Post the welcome/introduction message in this channel.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("roles")
        .setDescription("Post configured button and select-menu role panels in this channel.")
    ),
  async execute(interaction, client) {
    const subcommand = interaction.options.getSubcommand();
    await interaction.deferReply({ ephemeral: true });

    if (subcommand === "welcome") {
      await interaction.channel.send({ embeds: [introductionEmbed(client)] });
      await interaction.editReply("Welcome/introduction message posted.");
      return;
    }

    const buttonRows = buildButtonRoleRows(client.config.roles.buttonSets);
    const selectRows = buildSelectRoleRows(client.config.roles.selectMenus);
    const panels = [...buttonRows, ...selectRows];

    if (!panels.length) {
      const embed = baseEmbed(client, { color: colors.info })
        .setTitle("No role panels configured")
        .setDescription("Add BUTTON_ROLE_SETS or SELECT_ROLE_MENUS to the environment, then run this command again.");
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    for (const panel of panels) {
      await interaction.channel.send({
        content: panel.message,
        components: [panel.row]
      });
    }

    await interaction.editReply(`Posted ${panels.length} role panel${panels.length === 1 ? "" : "s"}.`);
  }
};
