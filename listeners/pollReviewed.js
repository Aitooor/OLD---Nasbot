const { messagesEn, messages, config } = require("..");
const { database } = require("../database/database");
const { checkLanguage } = require("../utils/messages");
const { isPoll } = require("../utils/polls");

module.exports = async (client, interaction, status) => {
    await interaction.deferReply();

    checkLanguage(interaction.member) ?
        embeds = {
            a: messages.invalid_id,
            b: messages.accepted_poll,
            c: messages.accepted_poll_embed,
        }
        :
        embeds = {
            a: messagesEn.invalid_id,
            b: messagesEn.accepted_poll,
            c: messages.accepted_poll_embed
        };

    if(!isPoll(interaction.message.id)) {
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

    const data = await database.get(`poll_${interaction.message.id}`);

    await interaction.guild.channels.resolve(data.language === "ES" ? config.poll.accepted_channel_es : config.poll.accepted_channel_en).send({
        embeds: [
            JSON.parse(JSON.stringify(embeds.c)
            .replace("%user%", data.authorTag)
            .replace("%description%", data.description)
            .replace("%1%", data.options[0])
            .replace("%2%", data.options[1]))
        ]
    })

    await interaction.editReply({
        embeds: [
            embeds.b
        ]
    })

    database.delete(`poll_${interaction.message.id}`)
};