const {
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js");
const { colors } = require("./embeds");
const { logMemberEvent } = require("./logging");

const ROLE_GROUP_SELECT_PREFIX = "role_group:";

function configuredRoles(group) {
  return group.filter((role) => role.roleId);
}

function roleGroupRow(groupName, roles, options = {}) {
  const configured = configuredRoles(roles);
  if (!configured.length) return null;

  const select = new StringSelectMenuBuilder()
    .setCustomId(`${ROLE_GROUP_SELECT_PREFIX}${groupName}`)
    .setPlaceholder(options.placeholder || "Pick roles")
    .setMinValues(0)
    .setMaxValues(options.singleChoice ? 1 : Math.min(configured.length, 25))
    .addOptions(
      configured.map((role) => ({
        label: role.label,
        value: role.roleId
      }))
    );

  return new ActionRowBuilder().addComponents(select);
}

function rolePanels(config) {
  const panels = [];

  const gameRow = roleGroupRow("games", config.roleGroups.games, {
    placeholder: "Pick your game roles"
  });
  if (gameRow) {
    panels.push({
      group: "games",
      row: gameRow,
      singleChoice: false
    });
  }

  const colorRow = roleGroupRow("colors", config.roleGroups.colors, {
    placeholder: "pick one colour role",
    singleChoice: true
  });
  if (colorRow) {
    panels.push({
      group: "colors",
      row: colorRow,
      singleChoice: true
    });
  }

  const activityRow = roleGroupRow("activities", config.roleGroups.activities, {
    placeholder: "pick activity roles"
  });
  if (activityRow) {
    panels.push({
      group: "activities",
      row: activityRow,
      singleChoice: false
    });
  }

  return panels;
}

function rolePanel(config, groupName) {
  return rolePanels(config).find((panel) => panel.group === groupName) || null;
}

async function updateRoleGroup(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const groupName = interaction.customId.slice(ROLE_GROUP_SELECT_PREFIX.length);
  const group = interaction.client.config.roleGroups[groupName];

  if (!group) {
    await interaction.editReply("that role menu is not configured anymore.");
    return;
  }

  const managedRoleIds = configuredRoles(group).map((role) => role.roleId);
  const selectedRoleIds = interaction.values;
  const addedRoles = [];
  const removedRoles = [];

  for (const roleId of managedRoleIds) {
    const role = interaction.guild.roles.cache.get(roleId);
    if (!role) continue;

    const hadRole = interaction.member.roles.cache.has(roleId);
    if (selectedRoleIds.includes(roleId)) {
      if (!hadRole) {
        await interaction.member.roles.add(role, `selected ${groupName} role`);
        addedRoles.push(role);
      }
    } else {
      if (hadRole) {
        await interaction.member.roles.remove(role, `updated ${groupName} roles`);
        removedRoles.push(role);
      }
    }
  }

  if (addedRoles.length || removedRoles.length) {
    const lines = [];
    if (addedRoles.length) lines.push(`added: ${addedRoles.map((role) => role.name).join(", ")}`);
    if (removedRoles.length) lines.push(`removed: ${removedRoles.map((role) => role.name).join(", ")}`);

    await logMemberEvent(
      interaction.client,
      interaction.guild,
      "role update",
      `${interaction.user.tag} (${interaction.user.id}) updated ${groupName} roles.\n${lines.join("\n")}`,
      colors.info
    );
  }

  await interaction.editReply("your roles have been updated.");
}

module.exports = {
  ROLE_GROUP_SELECT_PREFIX,
  rolePanel,
  rolePanels,
  updateRoleGroup
};
