const { EmbedBuilder } = require("discord.js");

const colors = {
  brand: 0xffc857,
  success: 0x43b581,
  danger: 0xed4245,
  info: 0x5865f2,
  muted: 0x2b2d31
};

// Edit these blank strings when you want to customize the visible embed wording.
// Leaving a value blank means the bot skips that title/description/field.
const embedText = {
  welcome: {
    title: "", // This becomes .setTitle("...") on the welcome embed.
    description: "", // This becomes .setDescription("...") on the welcome embed.
    firstFieldName: "", // This becomes the first .addFields({ name: "..." }).
    firstFieldValue: "" // This becomes the first .addFields({ value: "..." }).
  },
  verify: {
    title: "", // This becomes .setTitle("...") on the verify embed.
    description: "", // Explain what clicking the verify button does.
    buttonLabel: "" // Button text. Blank uses "Start verification".
  },
  roles: {
    title: "", // This becomes .setTitle("...") on the roles embed.
    description: "" // Explain which roles people can choose.
  },
  intro: {
    title: "", // This becomes .setTitle("...") on the intro embed.
    description: "" // Explain what should go in intros.
  },
  verified: {
    title: "", // This becomes .setTitle("...") after someone finishes verification.
    description: "" // Short success message after the intro form is submitted.
  }
};

function applyText(embed, text) {
  if (text?.title) embed.setTitle(text.title);
  if (text?.description) embed.setDescription(text.description);
  if (text?.firstFieldName && text?.firstFieldValue) {
    embed.addFields({ name: text.firstFieldName, value: text.firstFieldValue });
  }
  return embed;
}

function baseEmbed(client, options = {}) {
  const color = typeof options === "number" ? options : options.color ?? colors.brand;

  return new EmbedBuilder()
    .setColor(color)
    .setTimestamp()
    .setFooter({ text: client.config.communityName });
}

function welcomeEmbed(member, client) {
  const embed = baseEmbed(client, { color: colors.brand })
    .setThumbnail(member.user.displayAvatarURL({ size: 256 }));

  return applyText(embed, embedText.welcome);
}

function verifyEmbed(client) {
  return applyText(baseEmbed(client, { color: colors.info }), embedText.verify);
}

function rolesEmbed(client) {
  return applyText(baseEmbed(client, { color: colors.info }), embedText.roles);
}

function introPromptEmbed(client) {
  return applyText(baseEmbed(client, { color: colors.info }), embedText.intro);
}

function verifiedEmbed(client) {
  return applyText(baseEmbed(client, { color: colors.success }), embedText.verified);
}

function logEmbed(client, title, description, color = colors.muted) {
  return baseEmbed(client, { color })
    .setTitle(title)
    .setDescription(description);
}

module.exports = {
  baseEmbed,
  colors,
  embedText,
  introPromptEmbed,
  logEmbed,
  rolesEmbed,
  verifiedEmbed,
  verifyEmbed,
  welcomeEmbed
};
