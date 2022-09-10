const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { error } = require("../logs.js")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nick')
        .setDescription(config.commands.nick.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.nick.en,
            EnglishGB: config.commands.nick.en
        })
        .addStringOption(option => option
            .setName("nick")
            .setDescription("Escribe el nuevo nickname.")
            .setRequired(true))
        .addUserOption(option => option
            .setName("usuario")
            .setDescription("Elige a un usuario para colocarle el nick. Si no eliges ninguno se te pondrá a ti.")),
    async execute(interaction) {

        await interaction.deferReply();

        checkLanguage(interaction.member) ?
            embeds = {
                a: messages.nick,
                b: messages.error
            }
            :
            embeds = {
                a: messagesEn.nick,
                b: messagesEn.error   
            };

        try {
            
            interaction.options.getMember("usuario") ? member = interaction.options.getMember("usuario") : member = interaction.member;

            await member.setNickname(interaction.options.getString("nick"))

            await interaction.editReply({
                embeds: [
                    JSON.parse(JSON.stringify(embeds.a)
                    .replace("%nick%", interaction.options.getString("nick")))
                ],
                ephemeral: true
            })
        } catch(e) {
            error("Error al cambiar el nickname a un usuario. (Usando comando /nick). Stacktrace:")
            console.log(e)
            await interaction.editReply({
                embeds: [
                    embeds.b
                ]
            })
        }
    }
};