const { Events } = require("discord.js");
const { colors, logEmbed } = require("../utils/embeds");
const { logModeration } = require("../utils/logging");
const { ROLE_GROUP_SELECT_PREFIX, updateRoleGroup } = require("../utils/roles");
const { VERIFY_BUTTON_ID, verifyMember } = require("../utils/onboarding");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    try {
      if (interaction.isButton() && interaction.customId === VERIFY_BUTTON_ID) {
        await verifyMember(interaction);
        return;
      }

      if (interaction.isStringSelectMenu() && interaction.customId.startsWith(ROLE_GROUP_SELECT_PREFIX)) {
        await updateRoleGroup(interaction);
        return;
      }

      if (!interaction.isChatInputCommand()) return;

      if (!interaction.guild) {
        await interaction.reply({ content: "pancheesko commands only work inside the server.", ephemeral: true });
        return;
      }

      const command = client.commands.get(interaction.commandName);
      if (!command) {
        await interaction.reply({ content: "that command is not available right now.", ephemeral: true });
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
