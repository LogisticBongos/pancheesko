const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { introPromptEmbed, roleGroupEmbed, verifyEmbed } = require("../../utils/embeds");
const { verifyButtonRow } = require("../../utils/onboarding");
const { rolePanels } = require("../../utils/roles");
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
        .setName("roles")
        .setDescription("Post game and color role menus to the roles channel.")
    ),
  async execute(interaction, client) {
    const subcommand = interaction.options.getSubcommand();
    await interaction.deferReply({ ephemeral: true });

    if (subcommand === "roles") {
      const panels = rolePanels(client.config);
      const posted = [];

      for (const panel of panels) {
        const message = await sendToChannel(client, client.config.channels.roles, {
          embeds: [roleGroupEmbed(client, panel.group)],
          components: [panel.row]
        });
        if (message) posted.push(panel.group);
      }

      await interaction.editReply(
        posted.length
          ? `Posted role menus: ${posted.join(", ")}.`
          : "No role menus were posted. Add role IDs to .env first."
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
        : "No onboarding messages were posted. Check your channel IDs and role IDs."
    );
  }
};
