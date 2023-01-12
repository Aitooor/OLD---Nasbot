const { database } = require("../database/database.js");
const { isPoll } = require("../utils/polls.js");
const { isSuggestion } = require("../utils/suggestions.js");

module.exports = async (client, reaction) => {

	try {
		await reaction.fetch();
	} catch (e) {
		return;
	}

    if(isSuggestion(reaction.message.id)) {
        const datos = await database.get(`suggestion_${reaction.message.id}`)
		await client.emit("suggestionVoteAdd", reaction, datos.language === "ES" ? "ES" : "EN")
    }

	if(isPoll(reaction.message.id)) {
		client.emit("pollVoteAdd", reaction)
	}
}