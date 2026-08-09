const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embeds");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Show server information."),
  async execute(interaction, client) {
    const guild = interaction.guild;
    await guild.members.fetch();

    const embed = baseEmbed(client, { color: colors.info })
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL({ size: 256 }))
      .addFields(
        { name: "members", value: `${guild.memberCount}`, inline: true },
        { name: "created", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
        { name: "owner", value: `<@${guild.ownerId}>`, inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  }
};
