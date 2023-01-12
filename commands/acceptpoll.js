const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { database } = require("../database/database.js")
const { checkLanguage } = require("../utils/messages.js");
const { isPoll } = require("../utils/polls.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('acceptpoll')
        .setDescription(config.commands.acceptpoll.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.acceptpoll.en,
            EnglishGB: config.commands.acceptpoll.en
        })
        .addStringOption(option => option
            .setName("id")
            .setDescription("ID del mensaje.")
            .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply({
            ephemeral: true
        });

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

        if(!isPoll(interaction.options.getString("id"))) {
            return await interaction.editReply({
                embeds: [
                    embeds.a
                ]
            })
        }

        const data = await database.get(`poll_${interaction.options.getString("id")}`);

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
        await (await interaction.guild.channels.resolve(data.language === "ES" ? config.poll.review_channel_es : config.poll.review_channel_en).messages.fetch(interaction.options.getString("id"))).delete()
        database.delete(`poll_${interaction.options.getString("id")}`)
    }
};