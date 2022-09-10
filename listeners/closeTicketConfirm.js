const { ActionRowBuilder, ButtonBuilder } = require("discord.js")
const { tickets, ticketsEn } = require("..")
const transcripts = require("discord-html-transcripts");
const { database } = require("../database/database.js")

module.exports = async (client, interaction, language) => {

    await interaction.deferReply({
        ephemeral: true
    })
    
    if(language === "ES") {

        config = {
            a: tickets.messages.ticketClosedConfirmed,
            b: tickets.messages.clickToDelete,
            c: "ticketDeleteES",
            d: tickets.buttons.delete.label,
            e: tickets.buttons.delete.emoji,
            f: tickets.buttons.delete.color,
            g: tickets.messages.userTranscript,
            h: tickets.messages.staffTranscript,
            i: tickets.log_channel,
            j: tickets.messages.already_closed
        }

    } else {

        config = {
            a: ticketsEn.messages.ticketClosedConfirmed,
            b: ticketsEn.messages.clickToDelete,
            c: "ticketDeleteEN",
            d: ticketsEn.buttons.delete.label,
            e: ticketsEn.buttons.delete.emoji,
            f: ticketsEn.buttons.delete.color,
            g: ticketsEn.messages.userTranscript,
            h: ticketsEn.messages.staffTranscript,
            i: ticketsEn.log_channel,
            j: ticketsEn.messages.already_closed
        }

    }

    const datos = await database.get(`ticket_${interaction.channel.id}`);

    if(datos.isClosed) {
        return await interaction.editReply({
            embeds: [
                config.j
            ],
            ephemeral: true
        })
    }

    await database.set(`ticket_${interaction.channel.id}.isClosed`, true)

    for (const member of datos.users) {
        if(await interaction.guild.members.cache.find(m => m.id === member)) {
            await interaction.channel.permissionOverwrites.edit(member, { ViewChannel: false, SendMessages: false })
        }
    }

    const transcript = await transcripts.createTranscript(interaction.channel, {
        limit: -1,
        fileName: `${interaction.channel.name}.html`,
        useCDN: true
    });


    await interaction.guild.channels.resolve(config.i).send({
        files: [transcript],
        embeds: [
            JSON.parse(JSON.stringify(config.h)
            .replace("%canal%", interaction.channel.name)
            .replace("%staff%", interaction.member))
        ]
    })


    await database.subtract(`tickets_${interaction.channel.topic}`, 1)

    const member = await interaction.guild.members.cache.find(m => m.id === interaction.channel.topic)
        if(member) {
         await member.send({
                files: [transcript],
                embeds: [
                    JSON.parse(JSON.stringify(config.g)
                    .replace("%canal%", interaction.channel.name)
                    .replace("%staff%", interaction.member))
                ]
            })
            .catch((e) => {
                //Ok
            })
        }
    

    await interaction.editReply({
        embeds: [
            config.a
        ],
        ephemeral: true
    })

    await database

    await interaction.channel.send({
        embeds: [
            config.b
        ],
        components: [
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId(config.c)
                .setLabel(config.d)
                .setEmoji(config.e)
                .setStyle(config.f)
            )
        ]
    })
}