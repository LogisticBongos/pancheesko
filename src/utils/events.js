const { getJavaScriptFiles } = require("./loaders");

function registerEvents(client, eventsPath) {
  for (const file of getJavaScriptFiles(eventsPath)) {
    const event = require(file);
    if (!event.name || !event.execute) {
      console.warn(`Skipping event without name/execute: ${file}`);
      continue;
    }

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
}

module.exports = {
  registerEvents
};
