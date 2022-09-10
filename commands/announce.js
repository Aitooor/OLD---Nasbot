const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription(config.commands.announce.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.announce.en,
            EnglishGB: config.commands.announce.en
        })
        .addStringOption(option => option
            .setName("anuncio_es")
            .setDescription("Contenido del anuncio en español.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("anuncio_en")
            .setDescription("Contenido del anuncio en inglés.")
            .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply({
            ephemeral: true
        });

        checkLanguage(interaction.member) ?
        embeds = {
            a: messages.announce,
            b: messages.error
        }
        :
        embeds = {
            a: messagesEn.announce,
            b: messagesEn.error 
        };

    try {
        await interaction.guild.channels.fetch(config.announce.es)
        .then(async (channel) => {
            await channel.send({
                content: interaction.options.getString("anuncio_es").replace("%tab%", "\n")
            })
        })
        await interaction.guild.channels.fetch(config.announce.en)
        .then(async (channel) => {
            await channel.send({
                content: interaction.options.getString("anuncio_en").replace("%tab%", "\n")
            })
        })
        await interaction.editReply({
            embeds: [
                embeds.a
            ],
            ephemeral: true
        })
    } catch(e) {
        error("Error al enviar un anuncio. Stacktrace:")
        console.error(e)
        await interaction.editReply({
            embeds: [
                embeds.b
            ]
        })
    }
  }
};