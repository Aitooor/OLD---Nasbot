const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { error } = require("../logs.js")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription(config.commands.kick.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.kick.en,
            EnglishGB: config.commands.kick.en
        })
    	.addUserOption(option => option
            .setName("usuario")
            .setDescription("A quién se expulsará.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("razon")
            .setDescription("Motivo de la expulsión.")
            .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply({
            ephemeral: true
        });

        checkLanguage(interaction.member) ?
        embeds = {
            a: messages.cannot_kick,
            b: messages.kicked,
            c: messages.error
        }
        :
        embeds = {
            a: messagesEn.cannot_kick,
            b: messagesEn.kicked,
            c: messagesEn.error    
        };

        const miembro = interaction.guild.members.cache.find(m => m.id === interaction.options.getUser("usuario").id)

        if(!miembro || !miembro.kickable || !interaction.member.roles.highest.comparePositionTo(interaction.options.getMember("usuario").roles.highest) < 0) {
            return await interaction.editReply({
                embeds: [
                    embeds.a
                ],
                ephemeral: true
            })
        }

    try {
        await miembro.kick({ reason: interaction.options.getString("razon") })
        .then(async () => {
            await interaction.editReply({
                embeds: [
                    JSON.parse(JSON.stringify(embeds.b)
                    .replace("%user%", interaction.options.getMember("usuario"))
                    .replace("%razon%", interaction.options.getString("razon")))
                ]         
            })
        })
    } catch(e) {
        error("Error al kickear un usuario. Stacktrace:")
        console.error(e)
        await interaction.editReply({
            embeds: [
                embeds.c
            ]
        })
    }
  }
};