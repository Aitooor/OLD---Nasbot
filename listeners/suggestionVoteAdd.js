const { config, messages } = require("../index.js")
const { database } = require("../database/database.js")

module.exports = async (client, reaction, language) => {

    if(reaction.partial) {
	    try {
		    await reaction.fetch();
	    } catch (e) {
		    return;
	    }
    }

    if(language === "ES") {
        cnf = {
            a: config.suggestionsEs.reactions.down,
            b: config.suggestionsEs.reactions.up,
            c: config.suggestionsEs.votes_until_review,
            d: config.suggestionsEs.review_channel
        }
    } else {
        cnf = {
            a: config.suggestionsEn.reactions.down,
            b: config.suggestionsEn.reactions.up,
            c: config.suggestionsEn.votes_until_review,
            d: config.suggestionsEn.review_channel
        }
    }

    if(!reaction.message.reactions.cache.get(cnf.a)) return;

    const votos = (reaction.message.reactions.cache.get(cnf.b).count) + (reaction.message.reactions.cache.get(cnf.a).count);


    if(votos-2 >= cnf.c) {
        await reaction.message.guild.channels.cache.get(cnf.d).send({
            embeds: [
                reaction.message.embeds[0]
            ]
        })
        .then(async (message) => {
            await database.set(`suggestion_${message.id}`, await database.get(`suggestion_${reaction.message.id}`))
            await database.delete(`suggestion_${reaction.message.id}`)
        })
        await reaction.message.delete()
    }
}
