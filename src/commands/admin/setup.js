const { ChannelType, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { infoPanelEmbed, introPromptEmbed, roleGroupEmbed, verifyEmbed } = require("../../utils/embeds");
const { infoPanelButtonRow } = require("../../utils/infoPanel");
const { verifyButtonRow } = require("../../utils/onboarding");
const { rolePanel } = require("../../utils/roles");
const { sendToChannel } = require("../../utils/logging");
const { createMemberCounters } = require("../../utils/memberCounters");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Post the bot-led onboarding messages.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("onboarding")
        .setDescription("Post verify and intro messages to the configured channels.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("game-roles")
        .setDescription("Post the game role menu to the roles channel.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("colour-roles")
        .setDescription("Post the colour role menu to the roles channel.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("activity-roles")
        .setDescription("Post the activity role menu to the roles channel.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("platform-roles")
        .setDescription("Post the pc/console role menu to the roles channel.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("info-panel")
        .setDescription("Post the rules, faq, and info button panel.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("where to post it. defaults to this channel.")
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("member-counters")
        .setDescription("Create locked voice channels for member counts.")
    ),
  async execute(interaction, client) {
    const subcommand = interaction.options.getSubcommand();
    await interaction.deferReply({ ephemeral: true });

    if (subcommand === "member-counters") {
      const { humanChannel, totalChannel } = await createMemberCounters(client, interaction.guild);
      await interaction.editReply(
        [
          "created member counter voice channels.",
          "paste these into `.env`:",
          "```env",
          `MEMBER_COUNT_CHANNEL_ID=${totalChannel.id}`,
          `HUMAN_COUNT_CHANNEL_ID=${humanChannel.id}`,
          "```"
        ].join("\n")
      );
      return;
    }

    if (subcommand === "info-panel") {
      const channel = interaction.options.getChannel("channel") || interaction.channel;
      const message = channel?.isTextBased()
        ? await channel.send({
            embeds: [infoPanelEmbed(client)],
            components: [infoPanelButtonRow()]
          })
        : null;

      await interaction.editReply(
        message
          ? `posted server info panel in ${channel}.`
          : "i could not post the server info panel there."
      );
      return;
    }

    if (subcommand === "game-roles" || subcommand === "colour-roles" || subcommand === "activity-roles" || subcommand === "platform-roles") {
      const groups = {
        "activity-roles": "activities",
        "colour-roles": "colors",
        "game-roles": "games",
        "platform-roles": "platforms"
      };
      const labels = {
        "activity-roles": "activity roles",
        "colour-roles": "colour roles",
        "game-roles": "game roles",
        "platform-roles": "platform roles"
      };
      const group = groups[subcommand];
      const panel = rolePanel(client.config, group);

      const message = panel
        ? await sendToChannel(client, client.config.channels.roles, {
            embeds: [roleGroupEmbed(client, panel.group)],
            components: [panel.row]
          })
        : null;

      const label = labels[subcommand];
      await interaction.editReply(
        message
          ? `posted ${label}.`
          : `no ${label} menu was posted. add role ids to .env first.`
      );
      return;
    }

    const verifyMessage = await sendToChannel(client, client.config.channels.verify, {
      embeds: [verifyEmbed(client)],
      components: [verifyButtonRow(client)]
    });

    const introMessage = await sendToChannel(client, client.config.channels.intro, {
      embeds: [introPromptEmbed(client)]
    });

    const posted = [
      verifyMessage && "verify",
      introMessage && "intro"
    ].filter(Boolean);

    await interaction.editReply(
      posted.length
        ? `Posted onboarding messages: ${posted.join(", ")}.`
        : "no onboarding messages were posted. check your channel ids and role ids."
    );
  }
};
