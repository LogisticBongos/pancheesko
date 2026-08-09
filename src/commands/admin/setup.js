const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { introPromptEmbed, roleGroupEmbed, verifyEmbed } = require("../../utils/embeds");
const { verifyButtonRow } = require("../../utils/onboarding");
const { rolePanel } = require("../../utils/roles");
const { sendToChannel } = require("../../utils/logging");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Post the bot-led onboarding messages.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("onboarding")
        .setDescription("Post verify and intro messages to the configured channels.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("game-roles")
        .setDescription("Post the game role menu to the roles channel.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("colour-roles")
        .setDescription("Post the colour role menu to the roles channel.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("activity-roles")
        .setDescription("Post the activity role menu to the roles channel.")
    ),
  async execute(interaction, client) {
    const subcommand = interaction.options.getSubcommand();
    await interaction.deferReply({ ephemeral: true });

    if (subcommand === "game-roles" || subcommand === "colour-roles" || subcommand === "activity-roles") {
      const groups = {
        "activity-roles": "activities",
        "colour-roles": "colors",
        "game-roles": "games"
      };
      const labels = {
        "activity-roles": "activity roles",
        "colour-roles": "colour roles",
        "game-roles": "game roles"
      };
      const group = groups[subcommand];
      const panel = rolePanel(client.config, group);

      const message = panel
        ? await sendToChannel(client, client.config.channels.roles, {
            embeds: [roleGroupEmbed(client, panel.group)],
            components: [panel.row]
          })
        : null;

      const label = labels[subcommand];
      await interaction.editReply(
        message
          ? `posted ${label}.`
          : `no ${label} menu was posted. add role ids to .env first.`
      );
      return;
    }

    const verifyMessage = await sendToChannel(client, client.config.channels.verify, {
      embeds: [verifyEmbed(client)],
      components: [verifyButtonRow(client)]
    });

    const introMessage = await sendToChannel(client, client.config.channels.intro, {
      embeds: [introPromptEmbed(client)]
    });

    const posted = [
      verifyMessage && "verify",
      introMessage && "intro"
    ].filter(Boolean);

    await interaction.editReply(
      posted.length
        ? `Posted onboarding messages: ${posted.join(", ")}.`
        : "no onboarding messages were posted. check your channel ids and role ids."
    );
  }
};
