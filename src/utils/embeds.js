const { EmbedBuilder } = require("discord.js");

const colors = {
  brand: 0xffc857,
  white: 0xffffff,
  success: 0x43b581,
  danger: 0xed4245,
  info: 0x5865f2,
  muted: 0x2b2d31
};

// Edit these blank strings when you want to customize the visible embed wording.
// Leaving a value blank means the bot skips that title/description/field.
const embedText = {
  welcome: {
    title: "welcome to pancheesko", // This becomes .setTitle("...") on the welcome embed.
    description: "Please follow rules just dont be mean essentially and dont be surprised if servers a little dead its still new thanks you", // This becomes .setDescription("...") on the welcome embed.
    rulesFieldName: "rules", // This becomes a section heading in the welcome embed.
    rulesFieldValue: "be normal, be kind, and keep the server easy to hang out in. read rules.",
    rolesFieldName: "roles", // This becomes a section heading in the welcome embed.
    rolesFieldValue: "please visit {rolesChannel} and pick the roles you want.",
    introFieldName: "intro", // This becomes a section heading in the welcome embed.
    introFieldValue: "introductions are optional, but you can say hi in {introChannel} if you want."
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
    description: "select every game role you want to have. anything unselected will be removed."
  },
  colorRoles: {
    title: "colour roles", // This becomes .setTitle("...") above the colour role menu.
    description: "choose one colour role. picking a new one removes the old one."
  },
  activityRoles: {
    title: "activity roles", // This becomes .setTitle("...") above the activity role menu.
    description: "select every activity role you want to have. anything unselected will be removed."
  },
  platformRoles: {
    title: "platform roles", // This becomes .setTitle("...") above the platform role menu.
    description: "select pc, console, or both."
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
  const rolesChannel = client.config.channels.roles ? `<#${client.config.channels.roles}>` : "#roles";
  const introChannel = client.config.channels.intro ? `<#${client.config.channels.intro}>` : "#intro";
  const welcomeText = embedText.welcome;
  const embed = baseEmbed(client, { color: colors.white })
    .setThumbnail(member.user.displayAvatarURL({ size: 256 }));

  applyText(embed, welcomeText);

  embed.addFields(
    {
      name: welcomeText.rulesFieldName || "rules",
      value: welcomeText.rulesFieldValue || "please follow the rules.",
      inline: false
    },
    {
      name: welcomeText.rolesFieldName || "roles",
      value: (welcomeText.rolesFieldValue || "please visit {rolesChannel} and pick your roles.").replace("{rolesChannel}", rolesChannel),
      inline: false
    },
    {
      name: welcomeText.introFieldName || "intro",
      value: (welcomeText.introFieldValue || "say hi in {introChannel} when you are ready.").replace("{introChannel}", introChannel),
      inline: false
    }
  );

  if (client.config.assets.welcomeGifUrl) {
    embed.setImage(client.config.assets.welcomeGifUrl);
  }

  return embed;
}

function welcomePayload(member, client) {
  return {
    content: `${member}`,
    embeds: [welcomeEmbed(member, client)],
    allowedMentions: { users: [member.id] }
  };
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
    games: embedText.gameRoles,
    platforms: embedText.platformRoles
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
  welcomePayload,
  verifiedEmbed,
  verifyEmbed,
  welcomeEmbed
};
