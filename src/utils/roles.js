const {
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js");

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

  for (const roleId of managedRoleIds) {
    const role = interaction.guild.roles.cache.get(roleId);
    if (!role) continue;

    if (selectedRoleIds.includes(roleId)) {
      await interaction.member.roles.add(role, `selected ${groupName} role`);
    } else {
      await interaction.member.roles.remove(role, `updated ${groupName} roles`);
    }
  }

  await interaction.editReply("your roles have been updated.");
}

module.exports = {
  ROLE_GROUP_SELECT_PREFIX,
  rolePanel,
  rolePanels,
  updateRoleGroup
};
