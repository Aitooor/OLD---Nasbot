const { ActionRowBuilder, ButtonBuilder } = require("discord.js")
const { database } = require("../database/database.js")
const { tickets, ticketsEn } = require("../index.js")


module.exports = async (client, interaction, language) => {
    
        await interaction.deferReply()

        const datos = await database.get(`ticket_${interaction.channel.id}`)

        if(language === "ES") {
            messages = {
                a: tickets.messages.already_closed,
                b: tickets.messages.ticketClose,
                c: "closeTicketConfirmES",
                d: tickets.buttons.close_confirm_yes.label,
                e: tickets.buttons.close_confirm_yes.emoji,
                f: tickets.buttons.close_confirm_yes.color,
                g: tickets.buttons.close_confirm_no.label,
                h: tickets.buttons.close_confirm_no.emoji,
                i: tickets.buttons.close_confirm_no.color
            }
        } else {
            messages = {
                a: ticketsEn.messages.already_closed,
                b: ticketsEn.messages.ticketClose,
                c: "closeTicketConfirmEN",
                d: ticketsEn.buttons.close_confirm_yes.label,
                e: ticketsEn.buttons.close_confirm_yes.emoji,
                f: ticketsEn.buttons.close_confirm_yes.color,
                g: ticketsEn.buttons.close_confirm_no.label,
                h: ticketsEn.buttons.close_confirm_no.emoji,
                i: ticketsEn.buttons.close_confirm_no.color
            }
        }


        if(datos.isClosed) {
            return await interaction.editReply({
                embeds: [
                    messages.a
                ],
                ephemeral: true
            })
        }

        await interaction.editReply({
            embeds: [
                messages.b
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(messages.c)
                    .setLabel(messages.d)
                    .setEmoji(messages.e)
                    .setStyle(messages.f),
                    new ButtonBuilder()
                    .setCustomId("closeTicketCancel")
                    .setLabel(messages.g)
                    .setEmoji(messages.h)
                    .setStyle(messages.i)
                )
            ]
        })

}