const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require("discord.js");
const { embedText, verifiedEmbed } = require("./embeds");
const { sendToChannel } = require("./logging");

const VERIFY_BUTTON_ID = "onboarding_verify";
const INTRO_MODAL_ID = "onboarding_intro_modal";

function verifyButtonRow(client) {
  const label = embedText.verify.buttonLabel || "Start verification";

  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(VERIFY_BUTTON_ID)
      .setLabel(label)
      .setStyle(ButtonStyle.Success)
  );
}

function introModal() {
  const modal = new ModalBuilder()
    .setCustomId(INTRO_MODAL_ID)
    .setTitle("Server intro");

  const name = new TextInputBuilder()
    .setCustomId("name")
    .setLabel("Name or nickname")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const games = new TextInputBuilder()
    .setCustomId("games")
    .setLabel("Games you play")
    .setStyle(TextInputStyle.Short)
    .setRequired(false);

  const music = new TextInputBuilder()
    .setCustomId("music")
    .setLabel("Music you like or make")
    .setStyle(TextInputStyle.Short)
    .setRequired(false);

  const timezone = new TextInputBuilder()
    .setCustomId("timezone")
    .setLabel("Timezone / usual active time")
    .setStyle(TextInputStyle.Short)
    .setRequired(false);

  modal.addComponents(
    new ActionRowBuilder().addComponents(name),
    new ActionRowBuilder().addComponents(games),
    new ActionRowBuilder().addComponents(music),
    new ActionRowBuilder().addComponents(timezone)
  );

  return modal;
}

async function startVerification(interaction) {
  await interaction.showModal(introModal());
}

async function finishVerification(interaction) {
  const member = interaction.member;
  const { onboarding, channels } = interaction.client.config;

  if (onboarding.memberRoleId) {
    const memberRole = interaction.guild.roles.cache.get(onboarding.memberRoleId);
    if (memberRole) await member.roles.add(memberRole, "Completed bot onboarding");
  }

  if (onboarding.unverifiedRoleId) {
    const unverifiedRole = interaction.guild.roles.cache.get(onboarding.unverifiedRoleId);
    if (unverifiedRole) await member.roles.remove(unverifiedRole, "Completed bot onboarding");
  }

  const name = interaction.fields.getTextInputValue("name");
  const games = interaction.fields.getTextInputValue("games") || "Not answered";
  const music = interaction.fields.getTextInputValue("music") || "Not answered";
  const timezone = interaction.fields.getTextInputValue("timezone") || "Not answered";

  await sendToChannel(interaction.client, channels.intro, {
    content: `${interaction.user}`,
    embeds: [
      verifiedEmbed(interaction.client)
        .setAuthor({
          name: `${name}`,
          iconURL: interaction.user.displayAvatarURL()
        })
        .addFields(
          { name: "Games", value: games },
          { name: "Music", value: music },
          { name: "Timezone / active time", value: timezone }
        )
    ]
  });

  const nextSteps = [
    channels.roles ? `pick roles in <#${channels.roles}>` : "pick your roles",
    channels.general ? `say hi in <#${channels.general}>` : "say hi in general"
  ].join(" and ");

  await interaction.reply({
    content: `you're verified. next, ${nextSteps}.`,
    ephemeral: true
  });
}

module.exports = {
  INTRO_MODAL_ID,
  VERIFY_BUTTON_ID,
  finishVerification,
  startVerification,
  verifyButtonRow
};
