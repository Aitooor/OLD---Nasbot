const { config } = require("../index.js")
const { database } = require("../database/database.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = async (client, reaction) => {

    if(reaction.partial) {
	    try {
		    await reaction.fetch();
	    } catch (e) {
		    return;
	    }
    }

    if(!reaction.message.reactions.cache.get("2️⃣")) return;

    const votos = (reaction.message.reactions.cache.get("1️⃣").count) + (reaction.message.reactions.cache.get("2️⃣").count);
    const datos = await database.get(`poll_${reaction.message.id}`)

    if(datos.language === "ES") {
        cnf = {
            a: config.sugerenciasEs.buttonAccept,
            b: config.sugerenciasEs.buttonDeny
        }
      } else {
        cnf = {
            a: config.sugerenciasEn.buttonAccept,
            b: config.sugerenciasEn.buttonDeny
        }
      }

    if(votos-2 >= config.poll.votes_until_review) {
        await reaction.message.guild.channels.cache.get(datos.language === "ES" ? config.poll.review_channel_es : config.poll.review_channel_en).send({
            embeds: [
                reaction.message.embeds[0]
            ],
            components: [
              new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                .setLabel(cnf.a)
                .setStyle(ButtonStyle.Success)
                .setCustomId("accept_poll"),
                new ButtonBuilder()
                .setLabel(cnf.b)
                .setStyle(ButtonStyle.Danger)
                .setCustomId("deny_poll")
              )
            ]
        })
        .then(async (message) => {
            await database.set(`poll_${message.id}`, await database.get(`poll_${reaction.message.id}`))
            await database.delete(`poll_${reaction.message.id}`)
        })
        await reaction.message.delete()
    }
}