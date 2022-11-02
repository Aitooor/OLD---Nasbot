const { ChannelType, PermissionsBitField, ActionRowBuilder, ButtonBuilder } = require("discord.js")
const { database } = require("../database/database.js")
const { tickets, ticketsEn, config } = require("../index.js") 

module.exports = async (client, interaction, language) => {

    await interaction.deferReply({
        ephemeral: true
    })

    async function createChannel() {

        if(language === "ES") {
            embeds = {
                a: tickets.messages.ticketEmbed,
                b: tickets.messages.ticketContent,
                c: tickets.messages.ticketCreated
            }
            buttons = {
                a: tickets.buttons.close.label,
                b: tickets.buttons.close.color,
                c: tickets.buttons.close.emoji,
                d: tickets.buttons.callStaff.label,
                e: tickets.buttons.callStaff.color,
                f: tickets.buttons.callStaff.emoji
            }
            buttonIds = {
                a: "closeTicketES",
                b: "callStaffES"
            },
            misc = {
                a: tickets.channelName,
                b: tickets.parentId,
                c: tickets.staffRol
            }

            switch(interaction.values[0]) {
                case "ticket_value_0":
                    option = tickets.menu.options.a; break;
                case "ticket_value_1":
                    option = tickets.menu.options.b; break;
                case "ticket_value_2":
                    option = tickets.menu.options.c; break;
                case "ticket_value_3":
                    option = tickets.menu.options.d; break;
                case "ticket_value_4":
                    option = tickets.menu.options.e; break;
                case "ticket_value_5":
                    option = tickets.menu.options.f; break;
                case "ticket_value_6":
                    option = tickets.menu.options.g; break;
            }
        } else {
            embeds = {
                a: ticketsEn.messages.ticketEmbed,
                b: ticketsEn.messages.ticketContent,
                c: ticketsEn.messages.ticketCreated
            }
            buttons = {
                a: ticketsEn.buttons.close.label,
                b: ticketsEn.buttons.close.color,
                c: ticketsEn.buttons.close.emoji,
                d: ticketsEn.buttons.callStaff.label,
                e: ticketsEn.buttons.callStaff.color,
                f: ticketsEn.buttons.callStaff.emoji
            }
            buttonIds = {
                a: "closeTicketEN",
                b: "callStaffEN"
            }
            misc = {
                a: ticketsEn.channelName,
                b: ticketsEn.parentId,
                c: ticketsEn.staffRol
            }

            switch(interaction.values[0]) {
                case "ticket_value_0":
                    option = ticketsEn.menu.options.a; break;
                case "ticket_value_1":
                    option = ticketsEn.menu.options.b; break;
                case "ticket_value_2":
                    option = ticketsEn.menu.options.c; break;
                case "ticket_value_3":
                    option = ticketsEn.menu.options.d; break;
                case "ticket_value_4":
                    option = ticketsEn.menu.options.e; break;
                case "ticket_value_5":
                    option = ticketsEn.menu.options.f; break;
                case "ticket_value_6":
                    option = ticketsEn.menu.options.g; break;
            }
        }


        await interaction.guild.channels.create({
            name: misc.a.replace("%emoji%", option.emoji).replace("%user%", interaction.user.username).replace("%category%", option.shortName),
            type: ChannelType.GuildText,
            topic: interaction.member.id,
            parent: misc.b,
            permissionOverwrites: [
                {
                    id: interaction.member.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                },
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: misc.c,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                }
            ]
        })
        .then(async (channel) => {
            await channel.send({
                embeds: [
                    JSON.parse(JSON.stringify(option.embed)
                    .replace("%user", interaction.member))
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(buttonIds.b)
                        .setLabel(buttons.d)
                        .setStyle(buttons.e)
                        .setEmoji(buttons.f),
                        new ButtonBuilder()
                        .setCustomId(buttonIds.a)
                        .setLabel(buttons.a)
                        .setStyle(buttons.b)
                        .setEmoji(buttons.c)
                    )
                ]
            })

            await database.set(
                `ticket_${channel.id}`,
                {
                    owner: interaction.member.id,
                    channelName: channel.name,
                    users: [ interaction.member.id ],
                    isClosed: false,
                    category: interaction.values[0],
                    staffCalled: false
                }
            )

            await database.add(`tickets_${interaction.member.id}`, 1)

            await interaction.editReply({
                embeds: [
                    JSON.parse(JSON.stringify(embeds.c)
                    .replace("%canal%", channel))
                ]
            })
        })
    }

    var ticketCount = await database.get(`tickets_${interaction.member.id}`);
    if(ticketCount === null) {
        await database.set(`tickets_${interaction.member.id}`, 0)
    }

    if(language === "ES") {

        if(tickets.antispam.max_tickets_per_user <= ticketCount) {
            return await interaction.editReply({
                embeds: [
                    tickets.messages.max_tickets
                ]
            })
        }

        createChannel();

    } else {

        if(ticketsEn.antispam.max_tickets_per_user <= ticketCount) {
            return await interaction.editReply({
                embeds: [
                    ticketsEn.messages.max_tickets
                ]
            })
        }

        createChannel();
    } 

}
