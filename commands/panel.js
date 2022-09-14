const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js")
const { config, messages, tickets, ticketsEn } = require("../index.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel')
        .setDescription(config.commands.panel.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.panel.en,
            EnglishGB: config.commands.panel.en
        })
        .addStringOption(option => option
            .setName("mensaje")
            .setRequired(true)
            .setDescription("Panel que se enviará")
            .addChoices(
                {
                    name: "Tickets ES",
                    value: "ticketses"
                },
                {
                    name: "Tickets EN",
                    value: "ticketsen"
                },
                {
                    name: "Verificacion",
                    value: "verificacion"
                },
                {
                    name: "Lang",
                    value: "lang"
                }
            )),
    async execute(interaction) {

        await interaction.deferReply();

        if(interaction.options.getString("mensaje") === "verificacion") {

            await interaction.channel.send({
                embeds: [
                    messages.language
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setLabel(config.verificacion.button_es.label)
                        .setCustomId("verifyES")
                        .setStyle(config.verificacion.button_es.color),
                        new ButtonBuilder()
                        .setLabel(config.verificacion.button_en.label)
                        .setCustomId("verifyEN")
                        .setStyle(config.verificacion.button_en.color),
                        new ButtonBuilder()
                        .setLabel(config.verificacion.button_esn.label)
                        .setCustomId("verifyESN")
                        .setStyle(config.verificacion.button_esn.color)
                    )
                ]
            })

            await interaction.deleteReply()

        } else if(interaction.options.getString("mensaje") === "ticketses") {

            await interaction.channel.send({
                embeds: [
                    tickets.panel
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId("ticketCreateES")
                        .setLabel(tickets.buttons.open.label)
                        .setStyle(tickets.buttons.open.color)
                        .setEmoji(tickets.buttons.open.emoji)
                    )
                ]
            })

            await interaction.deleteReply()

        } else if(interaction.options.getString("mensaje") === "ticketsen") {

            await interaction.channel.send({
                embeds: [
                    ticketsEn.panel
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId("ticketCreateEN")
                        .setLabel(ticketsEn.buttons.open.label)
                        .setStyle(ticketsEn.buttons.open.color)
                        .setEmoji(ticketsEn.buttons.open.emoji)
                    )
                ]
            })

            await interaction.deleteReply()

        } else {

            await interaction.channel.send({
                embeds: [
                    messages.language
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setLabel(config.verificacion.button_es.label)
                        .setCustomId("es")
                        .setStyle(config.verificacion.button_es.color),
                        new ButtonBuilder()
                        .setLabel(config.verificacion.button_en.label)
                        .setCustomId("en")
                        .setStyle(config.verificacion.button_en.color),
                        new ButtonBuilder()
                        .setLabel(config.verificacion.button_esn.label)
                        .setCustomId("esn")
                        .setStyle(config.verificacion.button_esn.color)
                    )
                ]
            })

        }
    }
};
