const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("check whether pancheesko is awake."),
  async execute(interaction) {
    await interaction.reply({ content: `pong. websocket latency is ${interaction.client.ws.ping}ms.`, ephemeral: true });
  }
};
