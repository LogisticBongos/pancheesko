const fs = require("node:fs");
const path = require("node:path");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const { baseEmbed, colors, embedText, infoPanelResponseEmbed } = require("./embeds");

const INFO_PANEL_BUTTON_PREFIX = "info_panel:";
const INFO_PANEL_DYNAMIC_PREFIX = "info_panel:v2:";
const MAX_PANEL_OPTIONS = 25;
const BUTTONS_PER_ROW = 5;
const dataPath = path.join(__dirname, "..", "..", "data", "info-panels.json");

const oldPanelButtons = [
  { key: "rules", labelKey: "rulesButtonLabel" },
  { key: "faq", labelKey: "faqButtonLabel" },
  { key: "info", labelKey: "infoButtonLabel" }
];

function readPanels() {
  if (!fs.existsSync(dataPath)) return {};
  return JSON.parse(fs.readFileSync(dataPath, "utf8"));
}

function writePanels(panels) {
  fs.mkdirSync(path.dirname(dataPath), { recursive: true });
  fs.writeFileSync(dataPath, JSON.stringify(panels, null, 2));
}

function cleanValue(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function sectionId(index) {
  return index.toString(36);
}

function panelId() {
  return Date.now().toString(36);
}

function parsePanelSections(rawSections) {
  let parsed;

  try {
    parsed = JSON.parse(rawSections);
  } catch {
    throw new Error("sections must be valid json.");
  }

  const sections = Array.isArray(parsed) ? parsed : parsed.sections;
  if (!Array.isArray(sections) || !sections.length) {
    throw new Error("sections must include at least one button section.");
  }

  if (sections.length > MAX_PANEL_OPTIONS) {
    throw new Error(`discord only allows ${MAX_PANEL_OPTIONS} buttons on one panel.`);
  }

  return sections.map((section, index) => {
    const button = cleanValue(section.button || section.label || section.name || `option ${index + 1}`, 80);
    const title = cleanValue(section.title || button, 256);
    const description = cleanValue(section.text || section.description || section.message, 4096);
    const imageUrl = cleanValue(section.image || section.imageUrl || section.gif || "", 2048);

    if (!button) throw new Error(`section ${index + 1} needs a button label.`);
    if (!description && !imageUrl) throw new Error(`section ${index + 1} needs text or an image.`);

    return {
      button,
      description,
      id: sectionId(index),
      imageUrl,
      title
    };
  });
}

function buildPanelEmbed(client, panel) {
  const embed = baseEmbed(client, { color: colors.white });
  if (panel.title) embed.setTitle(panel.title);
  if (panel.description) embed.setDescription(panel.description);
  if (panel.imageUrl) embed.setImage(panel.imageUrl);
  return embed;
}

function buildSectionEmbed(client, section) {
  const embed = baseEmbed(client, { color: colors.info });
  if (section.title) embed.setTitle(section.title);
  if (section.description) embed.setDescription(section.description);
  if (section.imageUrl) embed.setImage(section.imageUrl);
  return embed;
}

function dynamicPanelButtonRows(panel) {
  const buttons = panel.sections.map((section) =>
    new ButtonBuilder()
      .setCustomId(`${INFO_PANEL_DYNAMIC_PREFIX}${panel.id}:${section.id}`)
      .setLabel(section.button)
      .setStyle(ButtonStyle.Secondary)
  );

  const rows = [];
  for (let index = 0; index < buttons.length; index += BUTTONS_PER_ROW) {
    rows.push(new ActionRowBuilder().addComponents(buttons.slice(index, index + BUTTONS_PER_ROW)));
  }

  return rows;
}

function createInfoPanel({ guildId, title, description, imageUrl, rawSections }) {
  const id = panelId();
  const panel = {
    description: cleanValue(description, 4096),
    guildId,
    id,
    imageUrl: cleanValue(imageUrl, 2048),
    sections: parsePanelSections(rawSections),
    title: cleanValue(title, 256)
  };
  const panels = readPanels();

  panels[guildId] ||= {};
  panels[guildId][id] = panel;
  writePanels(panels);

  return panel;
}

function infoPanelButtonRow() {
  return new ActionRowBuilder().addComponents(
    oldPanelButtons.map(({ key, labelKey }) =>
      new ButtonBuilder()
        .setCustomId(`${INFO_PANEL_BUTTON_PREFIX}${key}`)
        .setLabel(embedText.infoPanel[labelKey] || key)
        .setStyle(ButtonStyle.Secondary)
    )
  );
}

async function showInfoPanelResponse(interaction, client) {
  if (interaction.customId.startsWith(INFO_PANEL_DYNAMIC_PREFIX)) {
    const [, , panelIdValue, sectionIdValue] = interaction.customId.split(":");
    const panel = readPanels()[interaction.guild.id]?.[panelIdValue];
    const section = panel?.sections.find((entry) => entry.id === sectionIdValue);

    if (!section) {
      await interaction.reply({ content: "that info button is not set up anymore.", ephemeral: true });
      return;
    }

    await interaction.reply({
      embeds: [buildSectionEmbed(client, section)],
      ephemeral: true
    });
    return;
  }

  const panelName = interaction.customId.slice(INFO_PANEL_BUTTON_PREFIX.length);
  const knownPanel = oldPanelButtons.some((button) => button.key === panelName);

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
  INFO_PANEL_DYNAMIC_PREFIX,
  buildPanelEmbed,
  createInfoPanel,
  dynamicPanelButtonRows,
  infoPanelButtonRow,
  showInfoPanelResponse
};
