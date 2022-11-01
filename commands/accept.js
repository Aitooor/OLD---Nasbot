const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { database } = require("../database/database.js")
const { checkLanguage } = require("../utils/messages.js")
const sugUtils = require("../utils/suggestions.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('accept')
        .setDescription(config.commands.accept.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.accept.en,
            EnglishGB: config.commands.accept.en
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
                b: messages.accepted_suggestion,
                c: messages.accepted,
                d: config.suggestionsEs.accepted_channel
            }
            :
            embeds = {
                a: messagesEn.invalid_id,
                b: messagesEn.accepted_suggestion,
                c: messagesEn.accepted,
                d: config.suggestionsEn.accepted_channel  
            };

        if(!sugUtils.isSuggestion(interaction.options.getString("id"))) {
            return await interaction.editReply({
                embeds: [
                    embeds.a
                ]
            })
        }

        var data = await database.get(`suggestion_${interaction.options.getString("id")}`);

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
    }
};
