const { SlashCommandBuilder, DataResolver } = require("discord.js")
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

        const datos = await database.get(`ticket_${interaction.channel.id}`)

        if(checkLanguage(interaction.member)) {
            embeds = {
                a: messages.rise,
                b: messages.alr_rise,
                c: tickets.staffRol
            }
        var ticketCofig = tickets;
        } else {
            embeds = {
                a: messagesEn.rise,
                b: messagesEn.alr_rise,
                c: ticketsEn.staffRol
            };
        var ticketCofig = ticketsEn;
        }
        
        switch(datos.category) {
            case "ticket_value_0":
                option = ticketCofig.menu.options.a; break;
            case "ticket_value_1":
                option = ticketCofig.menu.options.b; break;
            case "ticket_value_2":
                option = ticketCofig.menu.options.c; break;
            case "ticket_value_3":
                option = ticketCofig.menu.options.d; break;
            case "ticket_value_4":
                option = ticketCofig.menu.options.e; break;
            case "ticket_value_5":
                option = ticketCofig.menu.options.f; break;
            case "ticket_value_6":
                option = ticketCofig.menu.options.g; break;
        }  

        if(database.get(`ticket_${interaction.channel.id}.rise`)) {
            return await interaction.editReply({
                embeds: [
                    embeds.b
                ]
            })
        }

        database.set(`ticket_${interaction.channel.id}.rise`, true)

        await interaction.channel.permissionOverwrites.edit(embeds.c, { ViewChannel: false })
        
        for (const rol of option.rise_roles) {
            await interaction.channel.permissionOverwrites.edit(rol, { ViewChannel: true, SendMessages: true })
        }

        await interaction.editReply({
            embeds: [
                embeds.a
            ]
        })

    }
};
