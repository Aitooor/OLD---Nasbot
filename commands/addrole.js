const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { error } = require("../logs.js")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addrole')
        .setDescription(config.commands.addrole.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.addrole.en,
            EnglishGB: config.commands.addrole.en
        })
        .addUserOption(option => option
            .setName("usuario")
            .setDescription("Elige el usuario al que se le dará el rol.")
            .setRequired(true))
        .addRoleOption(option => option
            .setName("rol")
            .setDescription("Elige el rol que se entregará")
            .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply();

        checkLanguage(interaction.member) ?
            embeds = {
                a: messages.no_permission_rol,
                b: messages.addrole,
                c: messages.error
            }
            :
            embeds = {
                a: messagesEn.no_permission_rol,
                b: messagesEn.addrole,
                c: messagesEn.error    
            };

        if(interaction.member.roles.highest.comparePositionTo(interaction.options.getRole("rol")) < 0) {
            return await interaction.editReply({
                embeds: [
                    embeds.a
                ],
                ephemeral: true
            })
        }

        try {
            await interaction.options.getMember("usuario").roles.add(interaction.options.getRole("rol").id)
            await interaction.editReply({
                embeds: [
                    JSON.parse(JSON.stringify(embeds.b)
                    .replace("%user%", interaction.options.getMember("usuario"))
                    .replace("%rol%", interaction.options.getRole("rol")))
                ],
                ephemeral: true
            })
        } catch(e) {
            error("Error al dar el rol a un usuario. (Usando comando /addrole). Stacktrace:")
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