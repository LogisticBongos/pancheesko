const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const { embedText } = require("./embeds");

const VERIFY_BUTTON_ID = "onboarding_verify";

function verifyButtonRow() {
  const label = embedText.verify.buttonLabel || "i agree";

  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(VERIFY_BUTTON_ID)
      .setLabel(label)
      .setStyle(ButtonStyle.Success)
  );
}

async function verifyMember(interaction) {
  const member = interaction.member;
  const { onboarding, channels } = interaction.client.config;

  if (onboarding.memberRoleId) {
    const memberRole = interaction.guild.roles.cache.get(onboarding.memberRoleId);
    if (memberRole) await member.roles.add(memberRole, "agreed to rules");
  }

  if (onboarding.unverifiedRoleId) {
    const unverifiedRole = interaction.guild.roles.cache.get(onboarding.unverifiedRoleId);
    if (unverifiedRole) await member.roles.remove(unverifiedRole, "agreed to rules");
  }

  const rolesStep = channels.roles ? `next, go to <#${channels.roles}> and pick your roles.` : "next, go pick your roles.";

  await interaction.reply({
    content: `you're verified. ${rolesStep}`,
    ephemeral: true
  });
}

module.exports = {
  VERIFY_BUTTON_ID,
  verifyButtonRow,
  verifyMember
};
