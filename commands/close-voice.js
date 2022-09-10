const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close-voice')
        .setDescription(config.commands.close_voice.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.close_voice.en,
            EnglishGB: config.commands.close_voice.en
        }),
    async execute(interaction) {

        await interaction.deferReply({
            ephemeral: true
        });

        checkLanguage(interaction.member) ?
            embeds = {
                a: messages.not_voice_channel,
                b: messages.not_ticket,
                c: messages.closed_voice
            }
            :
            embeds = {
                a: messagesEn.not_voice_channel,
                b: messagesEn.not_ticket,
                c: messagesEn.closed_voice    
            };

        if(!interaction.member.voice.channel) {
            return await interaction.editReply({
                embeds: [
                    embeds.a
                ]
            })
        }

        if(!interaction.member.voice.channel.name.startsWith("ticket")) {
            return await interaction.editReply({
                embeds: [
                    embeds.b
                ]
            })
        }

        await interaction.member.voice.channel.delete()

        await interaction.editReply({
            embeds: [
                embeds.c
            ]
        })
  }
};