const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { error } = require("../logs.js")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription(config.commands.unban.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.unban.en,
            EnglishGB: config.commands.unban.en
        })
        .addStringOption(option => option
            .setName("id")
            .setDescription("Id del usuario que será desbaneado")
            .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply({
            ephemeral: true
        });

        checkLanguage(interaction.member) ?
            embeds = {
                a: messages.unban,
                b: messages.not_banned,
                c: messages.error
            }
            :
            embeds = {
                a: messagesEn.unban,
                b: messagesEn.not_banned,
                c: messagesEn.error    
            };

        try {
            await interaction.guild.members.unban(interaction.options.getString("id"))
            .then(async () => {
                await interaction.editReply({
                    embeds: [
                        JSON.parse(JSON.stringify(embeds.a))
                    ],
                    ephemeral: true
                })
            })
            .catch(async (e) => {
                await interaction.editReply({
                    embeds: [
                        JSON.parse(JSON.stringify(embeds.b))
                    ],
                    ephemeral: true
                })
            })
        } catch(e) {
            error("Error al unbanear a un usuario. (Usando comando /unban). Stacktrace:")
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