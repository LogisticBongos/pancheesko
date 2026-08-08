const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { introPromptEmbed, rolesEmbed, verifyEmbed } = require("../../utils/embeds");
const { verifyButtonRow } = require("../../utils/onboarding");
const { roleSelectRow } = require("../../utils/roles");
const { sendToChannel } = require("../../utils/logging");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Post the bot-led onboarding messages.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("onboarding")
        .setDescription("Post verify, roles, and intro messages to the configured channels.")
    ),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    const verifyMessage = await sendToChannel(client, client.config.channels.verify, {
      embeds: [verifyEmbed(client)],
      components: [verifyButtonRow(client)]
    });

    const roleRow = roleSelectRow(client.config);
    const rolesMessage = roleRow
      ? await sendToChannel(client, client.config.channels.roles, {
          embeds: [rolesEmbed(client)],
          components: [roleRow]
        })
      : null;

    const introMessage = await sendToChannel(client, client.config.channels.intro, {
      embeds: [introPromptEmbed(client)]
    });

    const posted = [
      verifyMessage && "verify",
      rolesMessage && "roles",
      introMessage && "intro"
    ].filter(Boolean);

    await interaction.editReply(
      posted.length
        ? `Posted onboarding messages: ${posted.join(", ")}.`
        : "No onboarding messages were posted. Check your channel IDs and role IDs."
    );
  }
};
