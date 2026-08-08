const {
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js");

const ROLE_SELECT_ID = "onboarding_roles";

function configuredRoleOptions(config) {
  const roles = [
    ["gamer", "Gamer", "Games, LFG, clips, and gaming chat"],
    ["music", "Music", "Music chat, playlists, karaoke, and listening rooms"],
    ["art", "Art", "Art, edits, creative posts, and media"],
    ["media", "Media", "Media, clips, TikTok, and screenshots"],
    ["overwatch", "Overwatch", "Overwatch channel access or pings"],
    ["deadlock", "Deadlock", "Deadlock channel access or pings"],
    ["dbd", "DBD", "Dead by Daylight channel access or pings"],
    ["birthday", "Birthday", "Birthday pings and birthday channel stuff"]
  ];

  return roles
    .map(([key, label, description]) => ({
      label,
      value: config.onboarding.roleIds[key],
      description
    }))
    .filter((role) => role.value);
}

function roleSelectRow(config) {
  const options = configuredRoleOptions(config);
  if (!options.length) return null;

  const select = new StringSelectMenuBuilder()
    .setCustomId(ROLE_SELECT_ID)
    .setPlaceholder("Pick your roles")
    .setMinValues(0)
    .setMaxValues(Math.min(options.length, 8))
    .addOptions(options);

  return new ActionRowBuilder().addComponents(select);
}

async function updateSelectedRoles(interaction) {
  const options = configuredRoleOptions(interaction.client.config);
  const managedRoleIds = options.map((role) => role.value);
  const selectedRoleIds = interaction.values;

  for (const roleId of managedRoleIds) {
    const role = interaction.guild.roles.cache.get(roleId);
    if (!role) continue;

    if (selectedRoleIds.includes(roleId)) {
      await interaction.member.roles.add(role, "Selected during bot onboarding");
    } else {
      await interaction.member.roles.remove(role, "Removed during bot onboarding");
    }
  }

  await interaction.reply({
    content: "Your roles have been updated.",
    ephemeral: true
  });
}

module.exports = {
  ROLE_SELECT_ID,
  roleSelectRow,
  updateSelectedRoles
};
