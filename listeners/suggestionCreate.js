const { config, messages, messagesEn } = require("../index.js")
const { database } = require("../database/database.js")

module.exports = async (client, message, language) => {

    if(language === "ES") {
        cnf = {
            a: messages.suggestion,
            b: config.suggestionsEs.reactions.up,
            c: config.suggestionsEs.reactions.down
        }
    } else {
        cnf = {
            a: messagesEn.suggestion,
            b: config.suggestionsEn.reactions.up,
            c: config.suggestionsEn.reactions.down
        } 
    }

    await message.channel.send({
        embeds: [
            JSON.parse(JSON.stringify(cnf.a)
            .replace("%user%", message.author)
            .replace("%sugerencia%", message.content))
        ]
    })
    .then(async (msg) => {
        await message.delete();
        await database.set(`suggestion_${msg.id}`, {
            messageId: msg.id,
            language: language,
            channelId: msg.channel.id,
            content: message.content,
            authorId: message.author.id,
            authorTag: message.author.tag
        })

        await msg.react(cnf.b)
        await msg.react(cnf.c)
    })
}
