const { EmbedBuilder } = require("discord.js");

const colors = {
  brand: 0xffc857,
  success: 0x43b581,
  danger: 0xed4245,
  info: 0x5865f2,
  muted: 0x2b2d31
};

function baseEmbed(client, options = {}) {
  return new EmbedBuilder()
    .setColor(options.color ?? colors.brand)
    .setTimestamp()
    .setFooter({
      text: client.config.communityName,
      iconURL: client.user?.displayAvatarURL()
    });
}

function welcomeEmbed(member, client) {
  const { config } = client;
  const rules = config.channels.rules ? `<#${config.channels.rules}>` : "the rules";
  const roles = config.channels.roles ? `<#${config.channels.roles}>` : "role selection";
  const intro = config.channels.intro ? `<#${config.channels.intro}>` : "introductions";

  return baseEmbed(client)
    .setAuthor({
      name: `${member.user.username} joined ${config.communityName}`,
      iconURL: member.user.displayAvatarURL()
    })
    .setTitle(`Welcome to ${config.communityName}`)
    .setDescription(config.communityTagline)
    .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
    .addFields(
      { name: "Start here", value: `Check ${rules}, grab roles in ${roles}, and say hi in ${intro}.` },
      { name: "Member count", value: `${member.guild.memberCount}`, inline: true }
    );
}

function introductionEmbed(client) {
  const channels = client.config.channels;
  const lines = [
    "Drop a quick intro so people know what to invite you to.",
    "",
    "**Try:**",
    "Name or nickname",
    "Favorite games",
    "Music you make or listen to",
    "Timezone and usual play hours"
  ];

  if (channels.lfg) lines.push("", `Looking for a squad? Head to <#${channels.lfg}>.`);
  if (channels.music) lines.push(`Sharing tracks or playlists? Use <#${channels.music}>.`);

  return baseEmbed(client)
    .setTitle(`Introduce yourself to ${client.config.communityName}`)
    .setDescription(lines.join("\n"))
    .setColor(colors.info);
}

function logEmbed(client, title, description, color = colors.muted) {
  return baseEmbed(client, { color }).setTitle(title).setDescription(description);
}

module.exports = {
  baseEmbed,
  colors,
  introductionEmbed,
  logEmbed,
  welcomeEmbed
};
