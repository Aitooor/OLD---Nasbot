const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { error } = require("../logs.js")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription(config.commands.report.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.report.en,
            EnglishGB: config.commands.report.en
        })
        .addUserOption(option => option
            .setName("usuario")
            .setDescription("A quién quieres reportar.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("razon")
            .setDescription("Tu razón del reporte")
            .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply({
            ephemeral: true
        });

        checkLanguage(interaction.member) ?
            embeds = {
                a: messages.report_staff,
                b: messages.report_done,
                c: messages.error
            }
            :
            embeds = {
                a: messagesEn.report_staff,
                b: messagesEn.report_done,
                c: messagesEn.error    
            };

        try {
            await interaction.guild.channels.fetch(config.report.report_channel)
            .then(async(channel) => {
                channel.send({
                    embeds: [
                        JSON.parse(JSON.stringify(embeds.a)
                        .replace("%sender%", interaction.member)
                        .replace("%user%", interaction.options.getUser("usuario"))
                        .replace("%razon%", interaction.options.getString("razon")))
                    ]
                })
            })
            await interaction.editReply({
                embeds: [
                    JSON.parse(JSON.stringify(embeds.b)
                    .replace("%user%", interaction.options.getUser("usuario"))
                    .replace("%razon%", interaction.options.getString("razon")))
                ],
                ephemeral: true
            })
        } catch(e) {
            error("Error al enviar un mensaje de reporte. Stacktrace:")
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