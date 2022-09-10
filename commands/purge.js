const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { error } = require("../logs.js")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription(config.commands.purge.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.purge.en,
            EnglishGB: config.commands.purge.en
        })
        .addIntegerOption(option => option
            .setName("mensajes")
            .setDescription("Cantidad de mensajes que se borrarán.")
            .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply({
            ephemeral: true
        });

        checkLanguage(interaction.member) ?
        embeds = {
            a: messages.invalid_number,
            b: messages.purge,
            c: messages.error
        }
        :
        embeds = {
            a: messagesEn.invalid_number,
            b: messagesEn.purge,
            c: messagesEn.error    
        };

        var cantidad = interaction.options.getInteger("mensajes");
        if(0 >= cantidad || cantidad > 100) return await interaction.editReply({
            embeds: [
                embeds.a
            ]
        })

        try {
            await interaction.channel.bulkDelete(cantidad)
            await interaction.editReply({
                embeds: [
                    JSON.parse(JSON.stringify(embeds.b)
                    .replace("%amount%", cantidad))
                ],
                ephemeral: true
            })
        } catch(e) {
            error("Error al eliminar mensajes de un canal. (Usando el comando /purge). Stacktrace:")
            console.log(e)
            await interaction.editReply({
                embeds: [
                    embeds.c
                ],
                ephemeral: true
            })
        }
    }
};