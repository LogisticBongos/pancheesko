const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { welcomePayload } = require("../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("test-welcome")
    .setDescription("send a test welcome message to a channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("where to send the test welcome")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    const channel = interaction.options.getChannel("channel", true);
    if (!channel.isTextBased()) {
      await interaction.editReply("pick a text channel.");
      return;
    }

    await channel.send(welcomePayload(interaction.member, client));
    await interaction.editReply(`sent a test welcome in ${channel}.`);
  }
};
