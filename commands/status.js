const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const axios = require("axios")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription(config.commands.status.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.status.en,
            EnglishGB: config.commands.status.en
        }),
    async execute(interaction) {

        await interaction.deferReply();

        checkLanguage(interaction.member) ?
            embeds = {
                a: messages.status
            }
            :
            embeds = {
                a: messagesEn.status   
            };

        await axios.get(config.status.api)
        .then(async (response) => {

            response.data.players ? playerCount = response.data.players.online.toString() : playerCount = config.status.offline

            await interaction.editReply({
                embeds: [
                    JSON.parse(JSON.stringify(embeds.a)
                    .replace("%userCount%", playerCount))
                ]
            })
        })
    }
};