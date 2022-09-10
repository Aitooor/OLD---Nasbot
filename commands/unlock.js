const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription(config.commands.unlock.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.unlock.en,
            EnglishGB: config.commands.unlock.en
        }),
    async execute(interaction) {

        await interaction.deferReply({
            ephemeral: true
        });

        checkLanguage(interaction.member) ?
            embeds = {
                a: messages.unlock
            }
            :
            embeds = {
                a: messagesEn.unlock
            };

        for (const rol of config.lock_unlock.roles) {
            await interaction.channel.permissionOverwrites.edit(rol, { SendMessages: true })
        }

        await interaction.editReply({
            embeds: [
                embeds.a
            ],
            ephemeral: true
        })
    }
};