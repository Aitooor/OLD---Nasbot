const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { error } = require("../logs.js")
const ms = require("ms")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setdelay')
        .setDescription(config.commands.setdelay.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.setdelay.en,
            EnglishGB: config.commands.setdelay.en
        })
        .addStringOption(option => option
            .setName("tiempo")
            .setDescription("Tiempo que habrá que esperar entre mensaje.")
            .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply({
            ephemeral: true
        });

        checkLanguage(interaction.member) ?
        embeds = {
            a: messages.usage_setdelay,
            b: messages.setdelay,
            c: messages.error
        }
        :
        embeds = {
            a: messagesEn.usage_setdelay,
            b: messagesEn.setdelay,
            c: messagesEn.error    
        };
        
        if((ms(interaction.options.getString("tiempo")) / 1000) >= 21600) return await interaction.editReply({
            embeds: [
                embeds.a
            ]
        })

        try {
            await interaction.channel.setRateLimitPerUser((ms(interaction.options.getString("tiempo")) / 1000));
            await interaction.editReply({
                embeds: [
                    JSON.parse(JSON.stringify(embeds.b)
                    .replace("%time%", interaction.options.getString("tiempo")))
                ],
                ephemeral: true
            })
        } catch(e) {
            error("Error al crear el slowmode en un canal. (Usando el comando /setdelay). Stacktrace:")
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