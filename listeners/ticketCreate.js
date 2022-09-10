const { ActionRowBuilder, SelectMenuBuilder } = require("discord.js")
const { tickets, ticketsEn } = require("../index.js")


module.exports = async (client, interaction, language) => {

    await interaction.deferReply({
        ephemeral: true
    })


        const options = [];

        if(language === "ES") {
            messages = {
                a: tickets.messages.selectCategory,
                b: tickets.menu.placeholder,
                c: "ticketSelectedCategoryES"
            }

            var allOptions = [tickets.menu.options.a, tickets.menu.options.b, tickets.menu.options.c, tickets.menu.options.d, tickets.menu.options.e, tickets.menu.options.f, tickets.menu.options.g]

        } else {
            messages = {
                a: ticketsEn.messages.selectCategory,
                b: ticketsEn.menu.placeholder,
                c: "ticketSelectedCategoryEN"
            }

            var allOptions = [ticketsEn.menu.options.a, ticketsEn.menu.options.b, ticketsEn.menu.options.c, ticketsEn.menu.options.d, ticketsEn.menu.options.e, ticketsEn.menu.options.f, ticketsEn.menu.options.g]
        }

        for (let i = 0; i < allOptions.length; i++) {
            if(allOptions[i].enabled) {
                options.push({
                    label: allOptions[i].label,
                    emoji: allOptions[i].emoji,
                    value: `ticket_value_${i}`,
                    description: allOptions[i].description
                })
            }
        }


        await interaction.editReply({
            embeds: [
                messages.a
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                    .setCustomId(messages.c)
                    .setPlaceholder(messages.b)
                    .setOptions(options)
                )
            ]
        })
    

}