require("dotenv").config();

function parseJsonEnv(name, fallback) {
  const raw = process.env[name];
  if (!raw || raw.trim() === "") return fallback;

  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`${name} must be valid JSON: ${error.message}`);
  }
}

function getBoolean(name, fallback = false) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  return ["1", "true", "yes", "on"].includes(raw.toLowerCase());
}

const config = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  communityName: process.env.COMMUNITY_NAME || "Pancheesko",
  communityTagline: process.env.COMMUNITY_TAGLINE || "Games, music, and good company.",
  channels: {
    welcome: process.env.WELCOME_CHANNEL_ID,
    intro: process.env.INTRO_CHANNEL_ID,
    memberLog: process.env.MEMBER_LOG_CHANNEL_ID,
    modLog: process.env.MOD_LOG_CHANNEL_ID,
    rules: process.env.RULES_CHANNEL_ID,
    roles: process.env.ROLES_CHANNEL_ID,
    announcements: process.env.ANNOUNCEMENTS_CHANNEL_ID,
    events: process.env.EVENTS_CHANNEL_ID,
    music: process.env.MUSIC_CHANNEL_ID,
    lfg: process.env.LFG_CHANNEL_ID,
    support: process.env.SUPPORT_CHANNEL_ID
  },
  links: {
    website: process.env.WEBSITE_URL,
    twitch: process.env.TWITCH_URL,
    youtube: process.env.YOUTUBE_URL,
    spotify: process.env.SPOTIFY_URL,
    soundcloud: process.env.SOUNDCLOUD_URL,
    steam: process.env.STEAM_GROUP_URL
  },
  autoBan: {
    minus15RoleId: process.env.AUTO_BAN_MINUS15_ROLE_ID,
    minus15RoleName: process.env.AUTO_BAN_MINUS15_ROLE_NAME || "-15",
    reason: process.env.AUTO_BAN_REASON || "Automatic ban: member has the configured -15 role.",
    scanOnReady: getBoolean("AUTO_BAN_SCAN_ON_READY", false),
    dryRun: getBoolean("AUTO_BAN_DRY_RUN", false)
  },
  roles: {
    buttonSets: parseJsonEnv("BUTTON_ROLE_SETS", []),
    selectMenus: parseJsonEnv("SELECT_ROLE_MENUS", []),
    reactionSets: parseJsonEnv("REACTION_ROLE_SETS", [])
  }
};

function requireRuntimeConfig() {
  const missing = [];
  if (!config.token) missing.push("DISCORD_TOKEN");
  if (!config.clientId) missing.push("CLIENT_ID");

  if (missing.length) {
    throw new Error(`Missing required environment variable(s): ${missing.join(", ")}`);
  }
}

module.exports = {
  config,
  requireRuntimeConfig
};
