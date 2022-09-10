const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription(config.commands.lock.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.lock.en,
            EnglishGB: config.commands.lock.en
        }),
    async execute(interaction) {

        await interaction.deferReply({
            ephemeral: true
        });

        checkLanguage(interaction.member) ?
        embeds = {
            a: messages.lock
        }
        :
        embeds = {
            a: messagesEn.lock  
        };

        for (const rol of config.lock_unlock.roles) {
            await interaction.channel.permissionOverwrites.edit(rol, { SendMessages: false })
        }

        await interaction.editReply({
            embeds: [
                embeds.a
            ],
            ephemeral: true
        })
    }
};