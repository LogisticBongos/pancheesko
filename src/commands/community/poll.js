const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embeds");

const numberEmoji = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create a simple reaction poll.")
    .addStringOption((option) => option.setName("question").setDescription("poll question").setRequired(true))
    .addStringOption((option) => option.setName("option1").setDescription("First option").setRequired(true))
    .addStringOption((option) => option.setName("option2").setDescription("Second option").setRequired(true))
    .addStringOption((option) => option.setName("option3").setDescription("Third option"))
    .addStringOption((option) => option.setName("option4").setDescription("Fourth option"))
    .addStringOption((option) => option.setName("option5").setDescription("Fifth option")),
  async execute(interaction, client) {
    const question = interaction.options.getString("question", true);
    const options = [1, 2, 3, 4, 5]
      .map((number) => interaction.options.getString(`option${number}`))
      .filter(Boolean);

    const embed = baseEmbed(client, { color: colors.info })
      .setTitle(question)
      .setDescription(options.map((option, index) => `${numberEmoji[index]} ${option}`).join("\n"))
      .setAuthor({ name: `poll by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() });

    const message = await interaction.reply({ embeds: [embed], fetchReply: true });
    for (const emoji of numberEmoji.slice(0, options.length)) {
      await message.react(emoji);
    }
  }
};
