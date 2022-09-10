const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription(config.commands.info.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.info.en,
            EnglishGB: config.commands.info.en
        }),
    async execute(interaction) {

        await interaction.deferReply();

        checkLanguage(interaction.member) ?
            embeds = {
                a: messages.info
            }
            :
            embeds = {
                a: messagesEn.info    
            };

        await interaction.editReply({
            embeds: [
                embeds.a
            ]
        })
    }
};