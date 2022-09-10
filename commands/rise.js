const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn, tickets, ticketsEn } = require("../index.js")
const { checkLanguage } = require("../utils/messages.js")
const { database } = require("../database/database.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rise')
        .setDescription(config.commands.rise.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.rise.en,
            EnglishGB: config.commands.rise.en
        }),
    async execute(interaction) {

        await interaction.deferReply();

        checkLanguage(interaction.member) ?
            embeds = {
                a: messages.rise,
                b: messages.alr_rise,
                c: tickets.staffRol,
                d: tickets.adminRol
            }
            :
            embeds = {
                a: messagesEn.rise,
                b: messagesEn.alr_rise,
                c: ticketsEn.staffRol,
                d: ticketsEn.adminRol
            };

        if(database.get(`ticket_${interaction.channel.id}.rise`)) {
            return await interaction.editReply({
                embeds: [
                    embeds.b
                ]
            })
        }

        database.set(`ticket_${interaction.channel.id}.rise`, true)

        await interaction.channel.permissionOverwrites.edit(embeds.c, { ViewChannel: false })
        await interaction.channel.permissionOverwrites.edit(embeds.d, { ViewChannel: true, SendMessages: true })

        await interaction.reply({
            embeds: [
                embeds.a
            ]
        })

    }
};
