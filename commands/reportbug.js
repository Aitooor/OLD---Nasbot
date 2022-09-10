const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { error } = require("../logs.js")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reportbug')
        .setDescription(config.commands.reportbug.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.reportbug.en,
            EnglishGB: config.commands.reportbug.en
        })
        .addStringOption(option => option
            .setName("explicacion")
            .setDescription("Por favor, explica en que consiste dicho bug y dónde ocurre.")
            .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply({
            ephemeral: true
        });

        checkLanguage(interaction.member) ?
            embeds = {
                a: messages.reportbug_staff,
                b: messages.reportbug_done,
                c: messages.error
            }
            :
            embeds = {
                a: messagesEn.reportbug_staff,
                b: messagesEn.reportbug_done,
                c: messagesEn.error    
            };

        try {
            await interaction.guild.channels.fetch(config.report.reportbug_channel)
            .then(async(channel) => {
                channel.send({
                    embeds: [
                        JSON.parse(JSON.stringify(embeds.a)
                        .replace("%user%", interaction.member)
                        .replace("%bug%", interaction.options.getString("explicacion")))
                    ]
                })
            })
            await interaction.editReply({
                embeds: [
                    JSON.parse(JSON.stringify(embeds.b))
                ],
                ephemeral: true
            })
        } catch(e) {
            error("Error al enviar un mensaje de reporte de bug. Stacktrace:")
            console.error(e)
            await interaction.editReply({
                embeds: [
                    embeds.c
                ],
                ephemeral: true
            })
        }
    }
};