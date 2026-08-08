require("dotenv").config();

function getBoolean(name, fallback = false) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  return ["1", "true", "yes", "on"].includes(raw.toLowerCase());
}

function listEnv(name) {
  return (process.env[name] || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

const config = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  communityName: process.env.COMMUNITY_NAME || "Pancheesko",
  communityTagline: process.env.COMMUNITY_TAGLINE || "",
  channels: {
    mail: process.env.MAIL_CHANNEL_ID,
    intro: process.env.INTRO_CHANNEL_ID,
    verify: process.env.VERIFY_CHANNEL_ID,
    memberLog: process.env.LOG_CHANNEL_ID,
    modLog: process.env.MOD_LOG_CHANNEL_ID,
    rules: process.env.RULES_CHANNEL_ID,
    roles: process.env.ROLES_CHANNEL_ID,
    general: process.env.GENERAL_CHANNEL_ID,
    media: process.env.MEDIA_CHANNEL_ID,
    gaming: process.env.GAMING_CHANNEL_ID,
    art: process.env.ART_CHANNEL_ID,
    clips: process.env.CLIPS_CHANNEL_ID,
    vent: process.env.VENT_CHANNEL_ID,
    bots: process.env.BOTS_CHANNEL_ID,
    music: process.env.MUSIC_CHANNEL_ID,
    birthday: process.env.BIRTHDAY_CHANNEL_ID,
    overwatch: process.env.OVERWATCH_CHANNEL_ID,
    deadlock: process.env.DEADLOCK_CHANNEL_ID,
    dbd: process.env.DBD_CHANNEL_ID,
    robloxUser: process.env.ROBLOX_USER_CHANNEL_ID
  },
  channelMap: {
    main: ["rules", "mail", "roles", "verify", "intro", "secret", "tiktok", "log"],
    "001": ["general", "media", "gaming", "pets-woof-meow", "art", "clips", "vent", "roleplay"],
    "002": ["bots", "music", "mudae", "bump", "userphone", "birthday"],
    "003": ["overwatch", "deadlock", "dbd", "bnet-id", "steam-id", "roblox-user"],
    "004": ["voicechat", "cool kids", "overwatch", "deadlock", "dbd", "music", "karaoke", "super secret tickle time"]
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
  onboarding: {
    memberRoleId: process.env.MEMBER_ROLE_ID,
    unverifiedRoleId: process.env.UNVERIFIED_ROLE_ID,
    roleIds: {
      gamer: process.env.GAMER_ROLE_ID,
      music: process.env.MUSIC_ROLE_ID,
      art: process.env.ART_ROLE_ID,
      media: process.env.MEDIA_ROLE_ID,
      overwatch: process.env.OVERWATCH_ROLE_ID,
      deadlock: process.env.DEADLOCK_ROLE_ID,
      dbd: process.env.DBD_ROLE_ID,
      birthday: process.env.BIRTHDAY_ROLE_ID
    },
    extraRoleIds: listEnv("EXTRA_ROLE_IDS")
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
