const fs = require("node:fs");
const path = require("node:path");

function getJavaScriptFiles(root) {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) return getJavaScriptFiles(fullPath);
    return entry.isFile() && entry.name.endsWith(".js") ? [fullPath] : [];
  });
}

function loadCommands(client, commandsPath) {
  for (const file of getJavaScriptFiles(commandsPath)) {
    const command = require(file);
    if (!command.data || !command.execute) {
      console.warn(`Skipping command without data/execute: ${file}`);
      continue;
    }

    client.commands.set(command.data.name, command);
  }
}

function collectCommandData(commandsPath) {
  return getJavaScriptFiles(commandsPath)
    .map((file) => require(file))
    .filter((command) => command.data)
    .map((command) => command.data.toJSON());
}

module.exports = {
  collectCommandData,
  getJavaScriptFiles,
  loadCommands
};
