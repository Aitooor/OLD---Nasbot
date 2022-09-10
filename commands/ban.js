const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { error } = require("../logs.js")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription(config.commands.ban.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.ban.en,
            EnglishGB: config.commands.ban.en
        })
        .addUserOption(option => option
            .setName("usuario")
            .setDescription("El usuario que será baneado")
            .setRequired(true))
        .addStringOption(option => option
            .setName("razon")
            .setDescription("La razón del baneo")
            .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply({
            ephemeral: true
        });

        checkLanguage(interaction.member) ?
            embeds = {
                a: messages.cannot_ban,
                b: messages.banned,
                c: messages.error
            }
            :
            embeds = {
                a: messagesEn.cannot_ban,
                b: messagesEn.banned,
                c: messagesEn.error    
            };

        if(interaction.member.roles.highest.comparePositionTo(interaction.options.getMember("usuario").roles.highest) < 0 || !interaction.options.getMember("usuario").bannable) {
            return await interaction.editReply({
                embeds: [
                    embeds.a
                ],
                ephemeral: true
            })
        }

        try {
            await interaction.options.getMember("usuario").ban({
                reason: interaction.options.getString("razon")
            })
            await interaction.editReply({
                embeds: [
                    JSON.parse(JSON.stringify(embeds.b)
                    .replace("%user%", interaction.options.getMember("usuario"))
                    .replace("%razon%", interaction.options.getString("razon")))
                ],
                ephemeral: true
            })
        } catch(e) {
            error("Error al banear a un usuario. (Usando comando /ban). Stacktrace:")
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