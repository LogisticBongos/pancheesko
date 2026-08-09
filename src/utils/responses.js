const fs = require("node:fs");
const path = require("node:path");

const dataPath = path.join(__dirname, "..", "..", "data", "responses.json");

function normaliseTrigger(trigger) {
  return trigger.trim().toLowerCase();
}

function readResponses() {
  if (!fs.existsSync(dataPath)) return {};
  return JSON.parse(fs.readFileSync(dataPath, "utf8"));
}

function writeResponses(responses) {
  fs.mkdirSync(path.dirname(dataPath), { recursive: true });
  fs.writeFileSync(dataPath, JSON.stringify(responses, null, 2));
}

function guildResponses(guildId) {
  const responses = readResponses();
  return responses[guildId] || {};
}

function setResponse(guildId, trigger, response, authorId) {
  const responses = readResponses();
  responses[guildId] ||= {};
  responses[guildId][normaliseTrigger(trigger)] = {
    response,
    authorId,
    updatedAt: new Date().toISOString()
  };
  writeResponses(responses);
}

function removeResponse(guildId, trigger) {
  const responses = readResponses();
  const key = normaliseTrigger(trigger);
  const existed = Boolean(responses[guildId]?.[key]);

  if (responses[guildId]) {
    delete responses[guildId][key];
    writeResponses(responses);
  }

  return existed;
}

function findResponse(guildId, content) {
  const responses = guildResponses(guildId);
  const lowered = content.toLowerCase();

  return Object.entries(responses).find(([trigger]) => {
    return lowered.split(/\s+/).includes(trigger) || lowered.includes(trigger);
  });
}

module.exports = {
  findResponse,
  guildResponses,
  normaliseTrigger,
  removeResponse,
  setResponse
};
