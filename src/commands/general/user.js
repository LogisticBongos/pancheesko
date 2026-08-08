const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Show user information.")
    .addUserOption((option) => option.setName("member").setDescription("Member to inspect")),
  async execute(interaction, client) {
    const member = interaction.options.getMember("member") || interaction.member;
    const roles = member.roles.cache
      .filter((role) => role.id !== interaction.guild.id)
      .sort((a, b) => b.position - a.position)
      .map((role) => `${role}`)
      .slice(0, 12);

    const embed = baseEmbed(client, { color: colors.info })
      .setTitle(member.user.tag)
      .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: "Joined", value: member.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : "Unknown", inline: true },
        { name: "Created", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: "Roles", value: roles.length ? roles.join(", ") : "No roles" }
      );

    await interaction.reply({ embeds: [embed] });
  }
};
