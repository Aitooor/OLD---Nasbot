const { database } = require("../database/database.js")
const { tickets, ticketsEn } = require("../index.js") 

module.exports = async (client, interaction, language) => {

    if(language === "ES") {
        embeds = {
            a: tickets.messages.already_called_staff,
            b: tickets.messages.callStaff,
            c: tickets.staffRol
        }
    } else {
        embeds = {
            a: ticketsEn.messages.already_called_staff,
            b: ticketsEn.messages.callStaff,
            c: ticketsEn.staffRol
        }
    }

    const datos = database.get(`ticket_${interaction.channel.id}`);

    if(datos.calledStaff) {
        return await interaction.reply({
            embeds: [
                embeds.a
            ],
            ephemeral: true
        })
    }


    await database.set(`ticket_${interaction.channel.id}.calledStaff`, true)

    await interaction.channel.send({
        embeds: [
            JSON.parse(JSON.stringify(embeds.b)
            .replace("%rol%", `<@&${embeds.c}>`))
        ],
        content: `<@&${embeds.c}>`
    })

    await interaction.deferUpdate()
    

}