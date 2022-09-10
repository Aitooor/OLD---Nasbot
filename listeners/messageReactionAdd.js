const { database } = require("../database/database.js");
const utils = require("../utils/suggestions.js")

module.exports = async (client, reaction) => {

	try {
			await reaction.fetch();
	} catch (e) {
			return;
	}

    if(utils.isSuggestion(reaction.message.id)) {
        const datos = await database.get(`suggestion_${reaction.message.id}`)
		datos.language === "ES" ? await client.emit("suggestionVoteAdd", reaction, "ES") : await client.emit("suggestionVoteAdd", reaction, "EN");
    }
}