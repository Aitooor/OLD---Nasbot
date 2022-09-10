const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ip')
        .setDescription(config.commands.ip.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.ip.en,
            EnglishGB: config.commands.ip.en
        }),
    async execute(interaction) {

        await interaction.deferReply();

        checkLanguage(interaction.member) ?
            embeds = {
                a: messages.ip
            }
            :
            embeds = {
                a: messagesEn.ip   
            };

        await interaction.editReply({
            embeds: [
                embeds.a
            ]
        })
    }
};