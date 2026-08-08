const path = require("node:path");
const { REST, Routes } = require("discord.js");
const { config, requireRuntimeConfig } = require("./config");
const { collectCommandData } = require("./utils/loaders");

requireRuntimeConfig();

async function main() {
  const commands = collectCommandData(path.join(__dirname, "commands"));
  const rest = new REST({ version: "10" }).setToken(config.token);

  const route = config.guildId
    ? Routes.applicationGuildCommands(config.clientId, config.guildId)
    : Routes.applicationCommands(config.clientId);

  console.log(`Registering ${commands.length} slash commands...`);
  await rest.put(route, { body: commands });
  console.log(config.guildId ? "Guild commands registered." : "Global commands registered.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
