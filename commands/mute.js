const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { error } = require("../logs.js")
const ms = require("ms")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription(config.commands.mute.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.mute.en,
            EnglishGB: config.commands.mute.en
        })
    	.addUserOption(option => option
            .setName("usuario")
            .setDescription("El usuario que será muteado.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("tiempo")
            .setDescription("Durante cuanto tiempo el usuario estará muteado.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("razon")
            .setDescription("Motivo del muteo.")
            .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply({
            ephemeral: true
        });

        checkLanguage(interaction.member) ?
        embeds = {
            a: messages.cannot_mute,
            b: messages.usage_mute,
            c: messages.muted,
            d: messages.error
        }
        :
        embeds = {
            a: messagesEn.cannot_mute,
            b: messagesEn.usage_mute,
            c: messagesEn.muted,
            d: messagesEn.error  
        };

        const miembro = interaction.guild.members.cache.find(m => m.id === interaction.options.getMember("usuario").id)

        if(!miembro || !miembro.moderatable || !interaction.member.roles.highest.comparePositionTo(interaction.options.getMember("usuario").roles.highest) < 0) {
            return await interaction.editReply({
                embeds: [
                    embeds.a
                ]
            })
        }
        if(!ms(interaction.options.getString("tiempo"))) {
            return await interaction.editReply({
                embeds: [
                    embeds.b
                ]
            })
        }

    try {
        await miembro.timeout(ms(interaction.options.getString("tiempo")), interaction.options.getString("razon"))
        .then(async () => {
            await interaction.editReply({
                embeds: [
                    JSON.parse(JSON.stringify(embeds.c)
                    .replace("%user%", interaction.options.getMember("usuario"))
                    .replace("%time%", interaction.options.getString("tiempo"))
                    .replace("%razon%", interaction.options.getString("razon")))
                ]         
            })
        })
    } catch(e) {
        error("Error al mutear un usuario. Stacktrace:")
        console.error(e)
        await interaction.editReply({
            embeds: [
                embeds.d
            ]
        })
    }
  }
};