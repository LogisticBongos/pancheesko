# Pancheesko Discord Bot

A modular JavaScript Discord bot for the Pancheesko games-and-music community. It uses `discord.js` slash commands, environment-based configuration, attractive embeds, configurable role panels, join/leave logging, moderation tools, and guarded `-15` role auto-ban handling.

## Features

- Slash-command architecture with commands grouped by purpose.
- Button, select-menu, and reaction role support.
- Welcome and introduction embeds.
- Member join/leave logging.
- Moderation commands: ban, kick, timeout, untimeout, warn, purge, slowmode, and unban.
- Configurable `-15` role auto-ban with safeguards:
  - Requires an exact role ID.
  - Confirms the role name matches `AUTO_BAN_MINUS15_ROLE_NAME`.
  - Skips bots, server owner, elevated members, and members the bot cannot moderate.
  - Supports dry-run mode and manual preview scans.
- Community commands for links, LFG posts, event cards, polls, and recommendations.

This bot intentionally does not pretend to replace external services such as music streaming, ticketing, CRM tools, or paid moderation dashboards. It includes Discord-native workflows and clean places to connect external integrations later.

## Requirements

- Node.js 20 or newer.
- A Discord application and bot token.
- A Discord server where you can invite the bot with the needed permissions.

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

3. Fill in at least:

   ```env
   DISCORD_TOKEN=your-bot-token
   CLIENT_ID=your-application-client-id
   GUILD_ID=your-test-server-id
   ```

4. In the Discord Developer Portal, enable these privileged gateway intents for the bot:

   - Server Members Intent
   - Message Content Intent, only needed for reaction-role reliability around partial cached messages

5. Invite the bot with permissions for slash commands, reading/sending messages, managing roles, moderating members, kicking, banning, managing messages, and viewing channels. The bot role must be above any roles it assigns or moderates.

6. Register slash commands:

   ```bash
   pnpm run deploy:commands
   ```

7. Start the bot:

   ```bash
   pnpm start
   ```

## Configuration

All secrets and server-specific IDs live in `.env`. Keep `.env` private and commit only `.env.example`.

Important options:

- `WELCOME_CHANNEL_ID`, `INTRO_CHANNEL_ID`, `MEMBER_LOG_CHANNEL_ID`, `MOD_LOG_CHANNEL_ID`
- `RULES_CHANNEL_ID`, `ROLES_CHANNEL_ID`, `EVENTS_CHANNEL_ID`, `MUSIC_CHANNEL_ID`, `LFG_CHANNEL_ID`
- `AUTO_BAN_MINUS15_ROLE_ID`
- `AUTO_BAN_DRY_RUN=true` while testing
- `AUTO_BAN_SCAN_ON_READY=false` by default for safety

### Button Roles

```env
BUTTON_ROLE_SETS=[{"message":"Pick your pings.","roles":[{"label":"Events","roleId":"1234567890","emoji":"🎮"},{"label":"Music","roleId":"2345678901","emoji":"🎵"}]}]
```

Run `/setup roles` in the channel where you want the panel.

### Select-Menu Roles

```env
SELECT_ROLE_MENUS=[{"message":"Choose your community roles.","placeholder":"Pick roles","min":0,"max":3,"roles":[{"label":"FPS","roleId":"1234567890","description":"Shooter games"},{"label":"Producer","roleId":"2345678901","description":"Music makers"}]}]
```

Run `/setup roles` in the channel where you want the menu.

### Reaction Roles

```env
REACTION_ROLE_SETS=[{"messageId":"1234567890","emoji":"🎮","roleId":"2345678901","removeOnUnreact":true}]
```

Reaction roles bind to existing messages. Use custom emoji IDs for custom emoji, or the visible emoji character for standard emoji.

## `-15` Auto-Ban

Set `AUTO_BAN_MINUS15_ROLE_ID` to the exact role ID for the `-15` role. The bot also checks that the role name equals `AUTO_BAN_MINUS15_ROLE_NAME`, which defaults to `-15`.

Recommended rollout:

1. Set `AUTO_BAN_DRY_RUN=true`.
2. Run `/config-check`.
3. Run `/scan-minus15` without `execute` to preview matches.
4. Run `/scan-minus15 execute:true` only when the preview looks correct.
5. Set `AUTO_BAN_DRY_RUN=false` when ready.

The bot automatically bans members when the configured role is newly added. Startup scanning is off by default; enable `AUTO_BAN_SCAN_ON_READY=true` only after testing.

## Commands

- General: `/ping`, `/server`, `/user`, `/avatar`, `/links`
- Community: `/lfg`, `/recommend`, `/poll`, `/event`
- Setup/admin: `/setup welcome`, `/setup roles`, `/config-check`, `/scan-minus15`
- Moderation: `/ban`, `/kick`, `/timeout`, `/untimeout`, `/warn`, `/purge`, `/slowmode`, `/unban`

## Development

Check syntax and command loading:

```bash
pnpm run check
```

Run locally with file watching:

```bash
pnpm run dev
```

## Free Always-On Hosting

For a free always-on option, use Oracle Cloud Free Tier with an Always Free VM, install Node.js 20, clone this repo, add the `.env` file on the server, and run the bot with `pm2`:

```bash
pnpm install --prod
npm install -g pm2
pm2 start src/index.js --name pancheesko
pm2 save
pm2 startup
```

Render, Railway, and Fly.io are easier to use, but their free tiers and sleep behavior change over time. Oracle Cloud Free Tier is the best fit when the priority is a no-cost bot that stays online continuously.
