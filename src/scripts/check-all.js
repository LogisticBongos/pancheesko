const path = require("node:path");
const { execFileSync } = require("node:child_process");
const { collectCommandData, getJavaScriptFiles } = require("../utils/loaders");

const srcPath = path.join(__dirname, "..");
const commandsPath = path.join(srcPath, "commands");

for (const file of getJavaScriptFiles(srcPath)) {
  execFileSync(process.execPath, ["--check", file], { stdio: "inherit" });
}

const commands = collectCommandData(commandsPath);
const names = new Set();

for (const command of commands) {
  if (names.has(command.name)) {
    throw new Error(`Duplicate command name: ${command.name}`);
  }
  names.add(command.name);
}

console.log(`Checked ${commands.length} slash commands and ${getJavaScriptFiles(srcPath).length} JavaScript files.`);
