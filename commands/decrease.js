const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn, tickets, ticketsEn } = require("../index.js")
const { checkLanguage } = require("../utils/messages.js")
const { database } = require("../database/database.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('decrease')
        .setDescription(config.commands.decrease.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.decrease.en,
            EnglishGB: config.commands.decrease.en
        }),
    async execute(interaction) {

        await interaction.deferReply();


        if(checkLanguage(interaction.member)) {
            embeds = {
                a: messages.decrease,
                b: messages.alr_decrease,
                c: tickets.staffRol
            };
        } else {
            embeds = {
                a: messagesEn.decrease,
                b: messagesEn.alr_decrease,
                c: ticketsEn.staffRol
            };
        }

        if(!database.get(`ticket_${interaction.channel.id}.rise`)) {
            return await interaction.editReply({
                embeds: [
                    embeds.b
                ]
            })
        }

        database.set(`ticket_${interaction.channel.id}.rise`, false)

        await interaction.channel.permissionOverwrites.edit(embeds.c, { ViewChannel: true })
        

        await interaction.editReply({
            embeds: [
                embeds.a
            ]
        })

    }
};
