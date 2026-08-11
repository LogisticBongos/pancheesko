const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const { embedText } = require("./embeds");

const VERIFY_BUTTON_ID = "onboarding_verify";
const ROLE_REMINDER_DELETE_MS = 60_000;

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

  if (!channels.roles) return;

  const rolesChannel = await interaction.client.channels.fetch(channels.roles).catch(() => null);
  if (!rolesChannel?.isTextBased()) return;

  const reminder = await rolesChannel.send({
    content: `${member}, get your roles here when you're ready.`,
    allowedMentions: { users: [member.id] }
  }).catch(() => null);

  if (reminder) {
    setTimeout(() => {
      reminder.delete().catch(() => {});
    }, ROLE_REMINDER_DELETE_MS);
  }
}

module.exports = {
  VERIFY_BUTTON_ID,
  verifyButtonRow,
  verifyMember
};
