const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription(config.commands.invite.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.invite.en,
            EnglishGB: config.commands.invite.en
        }),
    async execute(interaction) {

        await interaction.deferReply();

        checkLanguage(interaction.member) ?
            embeds = {
                a: messages.invite
            }
            :
            embeds = {
                a: messagesEn.invite   
            };

        await interaction.editReply({
            embeds: [
                embeds.a
            ]
        })
    }
};