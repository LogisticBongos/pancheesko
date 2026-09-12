const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const { embedText, infoPanelResponseEmbed } = require("./embeds");

const INFO_PANEL_BUTTON_PREFIX = "info_panel:";

const panelButtons = [
  { key: "rules", labelKey: "rulesButtonLabel" },
  { key: "faq", labelKey: "faqButtonLabel" },
  { key: "info", labelKey: "infoButtonLabel" }
];

function infoPanelButtonRow() {
  return new ActionRowBuilder().addComponents(
    panelButtons.map(({ key, labelKey }) =>
      new ButtonBuilder()
        .setCustomId(`${INFO_PANEL_BUTTON_PREFIX}${key}`)
        .setLabel(embedText.infoPanel[labelKey] || key)
        .setStyle(ButtonStyle.Secondary)
    )
  );
}

async function showInfoPanelResponse(interaction, client) {
  const panelName = interaction.customId.slice(INFO_PANEL_BUTTON_PREFIX.length);
  const knownPanel = panelButtons.some((button) => button.key === panelName);

  if (!knownPanel) {
    await interaction.reply({ content: "that info button is not set up anymore.", ephemeral: true });
    return;
  }

  await interaction.reply({
    embeds: [infoPanelResponseEmbed(client, panelName)],
    ephemeral: true
  });
}

module.exports = {
  INFO_PANEL_BUTTON_PREFIX,
  infoPanelButtonRow,
  showInfoPanelResponse
};
