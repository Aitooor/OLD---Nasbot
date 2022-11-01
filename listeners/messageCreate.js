const { config } = require("../index.js")

module.exports = async (client, message) => {
    if(config.suggestionsEs.channels.some(ch => ch === message.channel.id) && message.author.id !== client.user.id) {
        await client.emit("suggestionCreate", message, "ES");
    }
    if(config.suggestionsEn.channels.some(ch => ch === message.channel.id) && message.author.id !== client.user.id) {
        await client.emit("suggestionCreate", message, "EN");
    }
}
