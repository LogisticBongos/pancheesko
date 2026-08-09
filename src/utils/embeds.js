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
    title: "verify", // This becomes .setTitle("...") on the verify embed.
    description: "read the rules, then press the button below to get access to the server. after that, head to roles and pick what you want.", // Explain what clicking the verify button does.
    buttonLabel: "i agree" // Button text.
  },
  roles: {
    title: "roles", // This becomes .setTitle("...") on the roles embed.
    description: "pick the roles you want from the menus below. you can come back and change them whenever."
  },
  gameRoles: {
    title: "game roles", // This becomes .setTitle("...") above the game role menu.
    description: "pick a role to turn it on or off. you can choose more than one."
  },
  colorRoles: {
    title: "colour roles", // This becomes .setTitle("...") above the colour role menu.
    description: "choose one colour role. picking a new one removes the old one."
  },
  activityRoles: {
    title: "activity roles", // This becomes .setTitle("...") above the activity role menu.
    description: "pick a role to turn it on or off. you can choose more than one."
  },
  intro: {
    title: "introductions", // This becomes .setTitle("...") on the intro embed.
    description: "introductions are optional. if you want, say your name, games you play, music you like, and when you are usually online."
  },
  verified: {
    title: "verified", // This becomes .setTitle("...") after someone verifies.
    description: "you are in. go pick your roles next."
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

function roleGroupEmbed(client, group) {
  const textByGroup = {
    activities: embedText.activityRoles,
    colors: embedText.colorRoles,
    games: embedText.gameRoles
  };
  const text = textByGroup[group] || embedText.roles;
  return applyText(baseEmbed(client, { color: colors.info }), text);
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
  roleGroupEmbed,
  rolesEmbed,
  verifiedEmbed,
  verifyEmbed,
  welcomeEmbed
};
