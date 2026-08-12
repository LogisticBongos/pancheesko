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

function responseList(entry) {
  if (!entry) return [];
  if (Array.isArray(entry.responses)) return entry.responses;
  if (entry.response) return [entry.response];
  return [];
}

function setResponse(guildId, trigger, response, authorId) {
  const responses = readResponses();
  const key = normaliseTrigger(trigger);
  const existing = responses[guildId]?.[key];
  const options = responseList(existing);

  if (!options.includes(response)) {
    options.push(response);
  }

  responses[guildId] ||= {};
  responses[guildId][key] = {
    responses: options,
    authorId,
    updatedAt: new Date().toISOString()
  };
  writeResponses(responses);

  return options.length;
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

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function triggerMatches(content, trigger) {
  const words = trigger.split(/\s+/).map(escapeRegex).join("\\s+");
  const pattern = new RegExp(`(^|[^\\p{L}\\p{N}_])${words}(?=$|[^\\p{L}\\p{N}_])`, "iu");
  return pattern.test(content);
}

function findResponse(guildId, content) {
  const responses = guildResponses(guildId);
  const lowered = content.toLowerCase();

  const match = Object.entries(responses).find(([trigger]) => {
    return triggerMatches(lowered, trigger);
  });

  if (!match) return null;

  const [trigger, entry] = match;
  const options = responseList(entry);
  if (!options.length) return null;

  const response = options[Math.floor(Math.random() * options.length)];
  return [trigger, { ...entry, response, responses: options }];
}

module.exports = {
  findResponse,
  guildResponses,
  normaliseTrigger,
  removeResponse,
  responseList,
  setResponse
};
