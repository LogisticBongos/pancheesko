const { Events } = require("discord.js");
const { colors, logEmbed } = require("../utils/embeds");
const { logModeration } = require("../utils/logging");
const { BUTTON_PREFIX, SELECT_PREFIX, syncSelectRoles, toggleRole } = require("../utils/roles");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    try {
      if (interaction.isButton() && interaction.customId.startsWith(BUTTON_PREFIX)) {
        await toggleRole(interaction, interaction.customId.slice(BUTTON_PREFIX.length));
        return;
      }

      if (interaction.isStringSelectMenu() && interaction.customId.startsWith(SELECT_PREFIX)) {
        await syncSelectRoles(interaction, Number(interaction.customId.slice(SELECT_PREFIX.length)));
        return;
      }

      if (!interaction.isChatInputCommand()) return;

      if (!interaction.guild) {
        await interaction.reply({ content: "Pancheesko commands only work inside the server.", ephemeral: true });
        return;
      }

      const command = client.commands.get(interaction.commandName);
      if (!command) {
        await interaction.reply({ content: "That command is not available right now.", ephemeral: true });
        return;
      }

      await command.execute(interaction, client);
    } catch (error) {
      console.error(`Interaction failed: ${error.stack || error.message}`);
      await logModeration(
        client,
        interaction.guild,
        "Command error",
        `${interaction.commandName || interaction.customId} failed for ${interaction.user.tag}: ${error.message}`,
        colors.danger
      );

      const payload = {
        embeds: [logEmbed(client, "Something went wrong", "I could not complete that action. Please check my permissions and try again.", colors.danger)],
        ephemeral: true
      };

      if (interaction.deferred || interaction.replied) {
        await interaction.followUp(payload).catch(() => {});
      } else {
        await interaction.reply(payload).catch(() => {});
      }
    }
  }
};
