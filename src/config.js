require("dotenv").config();

function getBoolean(name, fallback = false) {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  return ["1", "true", "yes", "on"].includes(raw.toLowerCase());
}

const config = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  communityName: process.env.COMMUNITY_NAME || "pancheesko",
  communityTagline: process.env.COMMUNITY_TAGLINE || "",
  assets: {
    welcomeGifUrl: process.env.WELCOME_GIF_URL
  },
  channels: {
    mail: process.env.MAIL_CHANNEL_ID,
    intro: process.env.INTRO_CHANNEL_ID,
    verify: process.env.VERIFY_CHANNEL_ID,
    memberLog: process.env.LOG_CHANNEL_ID,
    modLog: process.env.MOD_LOG_CHANNEL_ID,
    memberCount: process.env.MEMBER_COUNT_CHANNEL_ID,
    humanCount: process.env.HUMAN_COUNT_CHANNEL_ID,
    rules: process.env.RULES_CHANNEL_ID,
    roles: process.env.ROLES_CHANNEL_ID,
    secret: process.env.SECRET_CHANNEL_ID,
    tiktok: process.env.TIKTOK_CHANNEL_ID,
    general: process.env.GENERAL_CHANNEL_ID,
    media: process.env.MEDIA_CHANNEL_ID,
    gaming: process.env.GAMING_CHANNEL_ID,
    pets: process.env.PETS_CHANNEL_ID,
    art: process.env.ART_CHANNEL_ID,
    clips: process.env.CLIPS_CHANNEL_ID,
    vent: process.env.VENT_CHANNEL_ID,
    roleplay: process.env.ROLEPLAY_CHANNEL_ID,
    bots: process.env.BOTS_CHANNEL_ID,
    music: process.env.MUSIC_CHANNEL_ID,
    mudae: process.env.MUDAE_CHANNEL_ID,
    bump: process.env.BUMP_CHANNEL_ID,
    userphone: process.env.USERPHONE_CHANNEL_ID,
    birthday: process.env.BIRTHDAY_CHANNEL_ID,
    overwatch: process.env.OVERWATCH_CHANNEL_ID,
    deadlock: process.env.DEADLOCK_CHANNEL_ID,
    marvelRivals: process.env.MARVEL_RIVALS_CHANNEL_ID,
    league: process.env.LEAGUE_CHANNEL_ID,
    minecraft: process.env.MINECRAFT_CHANNEL_ID,
    roblox: process.env.ROBLOX_CHANNEL_ID,
    genshin: process.env.GENSHIN_CHANNEL_ID,
    fortnite: process.env.FORTNITE_CHANNEL_ID,
    dbd: process.env.DBD_CHANNEL_ID,
    bnetId: process.env.BNET_ID_CHANNEL_ID,
    steamId: process.env.STEAM_ID_CHANNEL_ID,
    robloxUser: process.env.ROBLOX_USER_CHANNEL_ID,
    voicechat: process.env.VOICECHAT_CHANNEL_ID,
    coolKidsVoice: process.env.COOL_KIDS_VOICE_CHANNEL_ID,
    overwatchVoice: process.env.OVERWATCH_VOICE_CHANNEL_ID,
    deadlockVoice: process.env.DEADLOCK_VOICE_CHANNEL_ID,
    fortniteVoice: process.env.FORTNITE_VOICE_CHANNEL_ID,
    minecraftVoice: process.env.MINECRAFT_VOICE_CHANNEL_ID,
    marvelRivalsVoice: process.env.MARVEL_RIVALS_VOICE_CHANNEL_ID,
    dbdVoice: process.env.DBD_VOICE_CHANNEL_ID,
    musicVoice: process.env.MUSIC_VOICE_CHANNEL_ID,
    karaokeVoice: process.env.KARAOKE_VOICE_CHANNEL_ID,
    superSecretTickleTimeVoice: process.env.SUPER_SECRET_TICKLE_TIME_VOICE_CHANNEL_ID
  },
  channelMap: {
    main: ["rules", "mail", "roles", "verify", "intro", "secret", "tiktok", "log"],
    "001": ["general", "media", "gaming", "pets-woof-meow", "art", "clips", "vent", "roleplay"],
    "002": ["bots", "music", "mudae", "bump", "userphone", "birthday"],
    "003": ["overwatch", "deadlock", "marvel-rivals", "lol", "minecraft", "roblox", "genshin", "fortnite", "dbd", "bnet-id", "steam-id", "roblox-user"],
    "004": ["voicechat", "cool kids", "overwatch", "deadlock", "fortnite", "minecraft", "marvel rivals", "dbd", "music", "karaoke", "super secret tickle time"]
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
    reason: process.env.AUTO_BAN_REASON || "automatic ban: member has the configured -15 role.",
    scanOnReady: getBoolean("AUTO_BAN_SCAN_ON_READY", false),
    dryRun: getBoolean("AUTO_BAN_DRY_RUN", false)
  },
  onboarding: {
    memberRoleId: process.env.MEMBER_ROLE_ID,
    unverifiedRoleId: process.env.UNVERIFIED_ROLE_ID
  },
  roleGroups: {
    games: [
      { key: "deadlock", label: "deadlock", roleId: process.env.DEADLOCK_ROLE_ID },
      { key: "league", label: "league of legends", roleId: process.env.LEAGUE_ROLE_ID },
      { key: "roblox", label: "roblox", roleId: process.env.ROBLOX_ROLE_ID },
      { key: "minecraft", label: "minecraft", roleId: process.env.MINECRAFT_ROLE_ID },
      { key: "overwatch", label: "overwatch", roleId: process.env.OVERWATCH_ROLE_ID },
      { key: "fortnite", label: "fortnite", roleId: process.env.FORTNITE_ROLE_ID },
      { key: "marvelRivals", label: "marvel rivals", roleId: process.env.MARVEL_RIVALS_ROLE_ID },
      { key: "genshin", label: "genshin", roleId: process.env.GENSHIN_ROLE_ID },
      { key: "dbd", label: "dbd", roleId: process.env.DBD_ROLE_ID }
    ],
    colors: [
      { key: "red", label: "red", roleId: process.env.RED_COLOR_ROLE_ID },
      { key: "darkRed", label: "dark red", roleId: process.env.DARK_RED_COLOR_ROLE_ID },
      { key: "orange", label: "orange", roleId: process.env.ORANGE_COLOR_ROLE_ID },
      { key: "yellow", label: "yellow", roleId: process.env.YELLOW_COLOR_ROLE_ID },
      { key: "green", label: "green", roleId: process.env.GREEN_COLOR_ROLE_ID },
      { key: "darkGreen", label: "dark green", roleId: process.env.DARK_GREEN_COLOR_ROLE_ID },
      { key: "blue", label: "blue", roleId: process.env.BLUE_COLOR_ROLE_ID },
      { key: "darkBlue", label: "dark blue", roleId: process.env.DARK_BLUE_COLOR_ROLE_ID },
      { key: "lilac", label: "lilac", roleId: process.env.LILAC_COLOR_ROLE_ID },
      { key: "purple", label: "purple", roleId: process.env.PURPLE_COLOR_ROLE_ID },
      { key: "pink", label: "pink", roleId: process.env.PINK_COLOR_ROLE_ID },
      { key: "black", label: "black", roleId: process.env.BLACK_COLOR_ROLE_ID },
      { key: "white", label: "white", roleId: process.env.WHITE_COLOR_ROLE_ID }
    ],
    activities: [
      { key: "deadChat", label: "dead chat", roleId: process.env.DEAD_CHAT_ROLE_ID },
      { key: "mail", label: "mail", roleId: process.env.MAIL_ROLE_ID },
      { key: "movieNight", label: "movie night", roleId: process.env.MOVIE_NIGHT_ROLE_ID },
      { key: "vcPing", label: "vc ping", roleId: process.env.VC_PING_ROLE_ID },
      { key: "gameNight", label: "game night", roleId: process.env.GAME_NIGHT_ROLE_ID },
      { key: "friendslop", label: "friendslop", roleId: process.env.FRIENDSLOP_ROLE_ID }
    ],
    platforms: [
      { key: "pc", label: "pc", roleId: process.env.PC_ROLE_ID },
      { key: "console", label: "console", roleId: process.env.CONSOLE_ROLE_ID }
    ]
  }
};

function requireRuntimeConfig() {
  const missing = [];
  if (!config.token) missing.push("DISCORD_TOKEN");
  if (!config.clientId) missing.push("CLIENT_ID");

  if (missing.length) {
    throw new Error(`missing required environment variable(s): ${missing.join(", ")}`);
  }
}

module.exports = {
  config,
  requireRuntimeConfig
};
