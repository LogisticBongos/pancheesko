const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { config, requireRuntimeConfig } = require("./config");
const { loadCommands } = require("./utils/loaders");
const { registerEvents } = require("./utils/events");

requireRuntimeConfig();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages
  ]
});

client.commands = new Collection();
client.config = config;

loadCommands(client, path.join(__dirname, "commands"));
registerEvents(client, path.join(__dirname, "events"));

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});

client.login(config.token);
