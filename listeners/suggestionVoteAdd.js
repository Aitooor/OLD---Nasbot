const { config } = require("../index.js")
const { database } = require("../database/database.js");
const { ActionRowBuilder, ButtonStyle } = require("discord.js");
const { ButtonBuilder } = require("@discordjs/builders");

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
        a: config.sugerenciasEs.reactions.down,
        b: config.sugerenciasEs.reactions.up,
        c: config.sugerenciasEs.votes_until_review,
        d: config.sugerenciasEs.review_channel,
        e: config.sugerenciasEs.buttonAccept,
        f: config.sugerenciasEs.buttonDeny
    }
  } else {
    cnf = {
        a: config.sugerenciasEn.reactions.down,
        b: config.sugerenciasEn.reactions.up,
        c: config.sugerenciasEn.votes_until_review,
        d: config.sugerenciasEn.review_channel,
        e: config.sugerenciasEn.buttonAccept,
        f: config.sugerenciasEn.buttonDeny
    }
  }

  if(!reaction.message.reactions.cache.get(cnf.a)) return;

    const votos = (reaction.message.reactions.cache.get(cnf.b).count) + (reaction.message.reactions.cache.get(cnf.a).count);


    if(votos-2 >= cnf.c) {
        await reaction.message.guild.channels.cache.get(cnf.d).send({
            embeds: [
                reaction.message.embeds[0]
            ],
            components: [
              new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                .setLabel(cnf.e)
                .setStyle(ButtonStyle.Success)
                .setCustomId("accept_suggestion"),
                new ButtonBuilder()
                .setLabel(cnf.f)
                .setStyle(ButtonStyle.Danger)
                .setCustomId("deny_suggestion")
              )
            ]
        })
        .then(async (message) => {
            await database.set(`suggestion_${message.id}`, await database.get(`suggestion_${reaction.message.id}`))
            await database.delete(`suggestion_${reaction.message.id}`)
        })
        await reaction.message.delete()
    }
}