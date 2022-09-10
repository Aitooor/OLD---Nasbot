const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { error } = require("../logs.js")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription(config.commands.unmute.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.unmute.en,
            EnglishGB: config.commands.unmute.en
        })
    	.addUserOption(option => option
            .setName("usuario")
            .setDescription("El usuario que será desmuteado.")
            .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply({
            ephemeral: true
        });

        checkLanguage(interaction.member) ?
            embeds = {
                a: messages.cannot_unmute,
                b: messages.unmuted,
                c: messages.error
            }
            :
            embeds = {
                a: messagesEn.cannot_unmute,
                b: messagesEn.unmuted,
                c: messagesEn.error    
            };

        const miembro = interaction.guild.members.cache.find(m => m.id === interaction.options.getMember("usuario").id)

        if(!miembro || !miembro.moderatable || !interaction.member.roles.highest.comparePositionTo(interaction.options.getMember("usuario").roles.highest) < 0) {
            return await interaction.editReply({
                embeds: [
                    embeds.a
                ]
            })
        }

    try {
        await miembro.timeout(null)
        .then(async () => {
            await interaction.editReply({
                embeds: [
                    JSON.parse(JSON.stringify(embeds.b)
                    .replace("%user%", interaction.options.getMember("usuario")))
                ]         
            })
        })
    } catch(e) {
        error("Error al desmutear un usuario. Stacktrace:")
        console.error(e)
        await interaction.editReply({
            embeds: [
                embeds.c
            ]
        })
    }
  }
};