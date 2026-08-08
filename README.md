# Pancheesko Discord Bot

A simple `discord.js` bot for running Pancheesko's welcome, verification, roles, logs, community commands, and moderation.

## What It Does

- Posts a bot-led onboarding flow with `/setup onboarding`.
- Welcomes new members in `mail`.
- Adds an optional unverified role when someone joins.
- Lets people verify through a button and intro form.
- Posts completed intros in `intro`.
- Gives the member role after verification.
- Lets people choose community roles in `roles`.
- Logs joins/leaves and moderation actions.
- Keeps the guarded `-15` auto-ban system.
- Includes moderation and community commands.

## Your Server Layout

This repo is based around the channel list you sent:

- Main: `rules`, `mail`, `roles`, `verify`, `intro`, `secret`, `tiktok`, `log`
- `001`: `general`, `media`, `gaming`, `pets-woof-meow`, `art`, `clips`, `vent`, `roleplay`
- `002`: `bots`, `music`, `mudae`, `bump`, `userphone`, `birthday`
- `003`: `overwatch`, `deadlock`, `dbd`, `bnet-id`, `steam-id`, `roblox-user`
- `004`: `voicechat`, `cool kids`, `overwatch`, `deadlock`, `dbd`, `music`, `karaoke`, `super secret tickle time`

Put the real channel IDs into `.env`.

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy `.env.example` to `.env`.

3. Fill in:

   ```env
   DISCORD_TOKEN=
   CLIENT_ID=
   GUILD_ID=
   MAIL_CHANNEL_ID=
   VERIFY_CHANNEL_ID=
   ROLES_CHANNEL_ID=
   INTRO_CHANNEL_ID=
   LOG_CHANNEL_ID=
   MEMBER_ROLE_ID=
   ```

4. Register commands:

   ```bash
   pnpm run deploy:commands
   ```

5. Start the bot:

   ```bash
   pnpm start
   ```

6. In Discord, run:

   ```text
   /setup onboarding
   ```

That posts the verify button in `verify`, the role selector in `roles`, and the intro prompt in `intro`.

## Editing Embed Messages

Edit:

```text
src/utils/embeds.js
```

Near the top is `embedText`. The title/description fields are intentionally blank and commented so you can fill them in without hunting through the code.

Example:

```js
verify: {
  title: "", // This becomes .setTitle("...") on the verify embed.
  description: "", // Explain what clicking the verify button does.
  buttonLabel: "" // Button text. Blank uses "Start verification".
}
```

You can change it to:

```js
verify: {
  title: "Verify",
  description: "Click the button below, answer the intro form, and you will get access.",
  buttonLabel: "Start"
}
```

Restart the bot after editing embed text. You only need to run `pnpm run deploy:commands` again if you edit slash command names, descriptions, or options.

## Role Setup

The verify form gives `MEMBER_ROLE_ID`.

The role selector in `roles` uses these optional IDs:

- `GAMER_ROLE_ID`
- `MUSIC_ROLE_ID`
- `ART_ROLE_ID`
- `MEDIA_ROLE_ID`
- `OVERWATCH_ROLE_ID`
- `DEADLOCK_ROLE_ID`
- `DBD_ROLE_ID`
- `BIRTHDAY_ROLE_ID`

Leave any of them blank to hide that option.

## `-15` Auto-Ban

Set:

```env
AUTO_BAN_MINUS15_ROLE_ID=
AUTO_BAN_MINUS15_ROLE_NAME=-15
AUTO_BAN_DRY_RUN=true
```

Recommended rollout:

1. Keep `AUTO_BAN_DRY_RUN=true`.
2. Run `/config-check`.
3. Run `/scan-minus15` to preview.
4. Run `/scan-minus15 execute:true` when ready.
5. Set `AUTO_BAN_DRY_RUN=false` after testing.

The bot checks the exact role ID and role name, skips bots/elevated members, and only bans people the bot can actually moderate.

## Commands

- Setup: `/setup onboarding`, `/config-check`, `/scan-minus15`
- General: `/ping`, `/server`, `/user`, `/avatar`, `/links`
- Community: `/lfg`, `/recommend`, `/poll`, `/event`
- Moderation: `/ban`, `/kick`, `/timeout`, `/untimeout`, `/warn`, `/purge`, `/slowmode`, `/unban`

## Check The Code

```bash
pnpm run check
```

## Free Always-On Hosting

Use an Oracle Cloud Free Tier Always Free VM if you want a no-cost bot that stays online. Install Node.js 20, clone the repo, fill in `.env`, then run it with `pm2`:

```bash
pnpm install --prod
npm install -g pm2
pm2 start src/index.js --name pancheesko
pm2 save
pm2 startup
```
