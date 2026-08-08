const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check whether Pancheesko is awake."),
  async execute(interaction) {
    await interaction.reply({ content: `Pong. WebSocket latency is ${interaction.client.ws.ping}ms.`, ephemeral: true });
  }
};
