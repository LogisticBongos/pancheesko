const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder
} = require("discord.js");

const BUTTON_PREFIX = "role_button:";
const SELECT_PREFIX = "role_select:";

function normalizeEmoji(emoji) {
  return emoji || undefined;
}

function applyEmoji(builder, emoji) {
  const normalized = normalizeEmoji(emoji);
  return normalized ? builder.setEmoji(normalized) : builder;
}

function buildButtonRoleRows(buttonSets) {
  const rows = [];
  let setIndex = 0;

  for (const set of buttonSets) {
    const roles = Array.isArray(set.roles) ? set.roles.slice(0, 25) : [];
    for (let i = 0; i < roles.length; i += 5) {
      const row = new ActionRowBuilder();
      for (const role of roles.slice(i, i + 5)) {
        const button = new ButtonBuilder()
            .setCustomId(`${BUTTON_PREFIX}${role.roleId}`)
            .setLabel(role.label || "Role")
            .setStyle(ButtonStyle.Secondary);
        row.addComponents(applyEmoji(button, role.emoji));
      }
      rows.push({ message: set.message || "Choose your roles.", row, setIndex });
    }
    setIndex += 1;
  }

  return rows;
}

function buildSelectRoleRows(selectMenus) {
  return selectMenus.flatMap((menu, index) => {
    const roles = Array.isArray(menu.roles) ? menu.roles.slice(0, 25) : [];
    if (!roles.length) return [];

    const select = new StringSelectMenuBuilder()
      .setCustomId(`${SELECT_PREFIX}${index}`)
      .setPlaceholder(menu.placeholder || "Choose roles")
      .setMinValues(Number.isInteger(menu.min) ? menu.min : 0)
      .setMaxValues(Math.min(menu.max || roles.length || 1, roles.length || 1))
      .addOptions(
        roles.map((role) => {
          const option = {
            label: role.label || "Role",
            value: role.roleId,
            description: role.description?.slice(0, 100)
          };
          const emoji = normalizeEmoji(role.emoji);
          if (emoji) option.emoji = emoji;
          return option;
        })
      );

    return [{
      message: menu.message || "Choose roles from the menu below.",
      row: new ActionRowBuilder().addComponents(select),
      index
    }];
  });
}

function findConfiguredSelectRole(client, menuIndex, roleId) {
  const menu = client.config.roles.selectMenus[menuIndex];
  return menu?.roles?.find((role) => role.roleId === roleId);
}

async function toggleRole(interaction, roleId) {
  const role = interaction.guild.roles.cache.get(roleId);
  if (!role) {
    await interaction.reply({ content: "That role is no longer available.", ephemeral: true });
    return;
  }

  const member = interaction.member;
  const hasRole = member.roles.cache.has(roleId);
  if (hasRole) {
    await member.roles.remove(role, `Role button used by ${interaction.user.tag}`);
    await interaction.reply({ content: `Removed ${role}.`, ephemeral: true });
  } else {
    await member.roles.add(role, `Role button used by ${interaction.user.tag}`);
    await interaction.reply({ content: `Added ${role}.`, ephemeral: true });
  }
}

async function syncSelectRoles(interaction, menuIndex) {
  const menu = interaction.client.config.roles.selectMenus[menuIndex];
  if (!menu) {
    await interaction.reply({ content: "That role menu is no longer configured.", ephemeral: true });
    return;
  }

  const allowedRoleIds = new Set(menu.roles.map((role) => role.roleId));
  const selectedRoleIds = new Set(interaction.values);
  const toAdd = [...selectedRoleIds].filter((roleId) => allowedRoleIds.has(roleId));
  const toRemove = [...allowedRoleIds].filter((roleId) => !selectedRoleIds.has(roleId));

  for (const roleId of toAdd) {
    const role = interaction.guild.roles.cache.get(roleId);
    if (role && !interaction.member.roles.cache.has(roleId)) {
      await interaction.member.roles.add(role, `Role select menu used by ${interaction.user.tag}`);
    }
  }

  for (const roleId of toRemove) {
    const role = interaction.guild.roles.cache.get(roleId);
    if (role && interaction.member.roles.cache.has(roleId)) {
      await interaction.member.roles.remove(role, `Role select menu used by ${interaction.user.tag}`);
    }
  }

  await interaction.reply({ content: "Your roles are updated.", ephemeral: true });
}

async function handleReactionRole(reaction, user, client, shouldAdd) {
  if (user.bot) return;
  if (reaction.partial) await reaction.fetch();
  if (reaction.message.partial) await reaction.message.fetch();

  const emojiKey = reaction.emoji.id || reaction.emoji.name;
  const match = client.config.roles.reactionSets.find((set) => {
    return set.messageId === reaction.message.id && set.emoji === emojiKey;
  });

  if (!match) return;
  if (!shouldAdd && match.removeOnUnreact === false) return;

  const member = await reaction.message.guild.members.fetch(user.id);
  const role = reaction.message.guild.roles.cache.get(match.roleId);
  if (!role) return;

  if (shouldAdd) {
    await member.roles.add(role, `Reaction role ${emojiKey}`);
  } else {
    await member.roles.remove(role, `Reaction role ${emojiKey} removed`);
  }
}

module.exports = {
  BUTTON_PREFIX,
  SELECT_PREFIX,
  buildButtonRoleRows,
  buildSelectRoleRows,
  findConfiguredSelectRole,
  handleReactionRole,
  syncSelectRoles,
  toggleRole
};
