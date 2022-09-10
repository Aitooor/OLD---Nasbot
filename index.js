const { Client, IntentsBitField, Partials } = require("discord.js");
const client = new Client({ intents: [new IntentsBitField(3276799)], partials: [Partials.Message, Partials.Channel, Partials.Reaction] });
const { load } = require("js-yaml");
const { readFileSync } = require("fs");
const { log, error } = require("./logs.js")

var config = load(readFileSync("./configs/config.yml", "utf8"), 4);
var messages = load(readFileSync("./configs/messages.yml", "utf8"), 4);
var messagesEn = load(readFileSync("./configs/messages_en.yml", "utf8"), 4);
var tickets = load(readFileSync("./configs/tickets.yml", "utf8"), 4);
var ticketsEn = load(readFileSync("./configs/tickets_en.yml", "utf8"), 4);

const GiveawayFramework = require("discord-giveaways")
const giveawayManager = new GiveawayFramework.GiveawaysManager(client, {
    storage: "./sorteos.json",
    default: {
        botsCanWin: false,
        embedColor: config.giveaways.embed.color,
        embedColorEnd: config.giveaways.embedend.color,
        reaction: config.giveaways.reaction
    }
})

module.exports = {
    config,
    messages,
    messagesEn,
    giveawayManager,
    tickets,
    ticketsEn,
    client
}

try {
    require("./handlers/commands.js")(client)
    require("./handlers/events.js")(client)
    log("Command handler y event handler cargados.")
} catch(e) {
    error("Hubo un error al cargar los handlers. Stacktrace:")
    console.error(e)
}


client.login(config.token)