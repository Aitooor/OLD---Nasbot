const { messagesEn, messages, config } = require("..");
const { database } = require("../database/database");
const { checkLanguage } = require("../utils/messages");
const { isSuggestion } = require("../utils/suggestions");

module.exports = async (client, interaction, status) => {
    await interaction.deferReply();

    checkLanguage(interaction.member) ?
        embeds = {
            a: messages.invalid_id,
            b: messages.accepted_suggestion,
            c: messages.accepted,
            d: config.sugerenciasEs.accepted_channel
        }
        :
        embeds = {
            a: messagesEn.invalid_id,
            b: messagesEn.accepted_suggestion,
            c: messagesEn.accepted,
            d: config.sugerenciasEn.accepted_channel  
        };

    if(!isSuggestion(interaction.message.id)) {
        return await interaction.editReply({
            embeds: [
                embeds.a
            ]
        })
    }

    await interaction.message.delete()
    if (status === "DENIED") {
        await interaction.deleteReply()
        database.delete(`suggestion_${interaction.message.id}`)
        return;
    }

    var data = await database.get(`suggestion_${interaction.message.id}`);

    await interaction.guild.channels.resolve(embeds.d).send({
        embeds: [
            JSON.parse(JSON.stringify(embeds.b)
            .replace("%user%", data.authorTag)
            .replace("%sugerencia%", data.content))
        ]
    })

    await interaction.editReply({
        embeds: [
            embeds.c
        ]
    })
    database.delete(`suggestion_${interaction.message.id}`)
};