const { SlashCommandBuilder } = require("discord.js");
const { database } = require("../database/database.js");
const { config, messages, messagesEn } = require("../index.js");
const { error } = require("../logs.js");
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription(config.commands.poll.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.poll.en,
            EnglishGB: config.commands.poll.en
        })
        .addStringOption(option => option
            .setName("desc_es")
            .setDescription("Descripción en español.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("opcion_1")
            .setDescription("Opción 1 en español.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("opcion_2")
            .setDescription("Opción 2 en español.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("desc_en")
            .setDescription("Descripción en inglés.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("option_1")
            .setDescription("Opción 1 en inglés.")
            .setRequired(true))
        .addStringOption(option => option
            .setName("option_2")
            .setDescription("Opción 2 en inglés.")
            .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply({
            ephemeral: true
        });

        checkLanguage(interaction.member) ?
        embeds = {
            a: messages.poll_sent,
            b: messages.error
        }
        :
        embeds = {
            a: messagesEn.poll_sent,
            b: messagesEn.error
        };

    try {
        await interaction.guild.channels.fetch(config.poll.es)
        .then(async (channel) => {
            await channel.send({
                embeds: [
                    JSON.parse(JSON.stringify(messages.poll)
                    .replaceAll("%tab%", "\n")
                    .replaceAll("%desc%", interaction.options.getString("desc_es"))
                    .replaceAll("%1%", interaction.options.getString("opcion_1"))
                    .replaceAll("%2%", interaction.options.getString("opcion_2")))
                ]
            }).then(async (message) => {
                await message.react("1️⃣")
                await message.react("2️⃣")

                await database.set(`poll_${message.id}`, {
                    messageId: message.id,
                    description: interaction.options.getString("desc_es"),
                    options: [
                        interaction.options.getString("opcion_1"),
                        interaction.options.getString("opcion_2")
                    ],
                    authorId: interaction.member.id,
                    authorTag: interaction.user.tag,
                    language: "ES"
                })
            })
        })
        await interaction.guild.channels.fetch(config.poll.en)
        .then(async (channel) => {
            await channel.send({
                embeds: [
                    JSON.parse(JSON.stringify(messagesEn.poll)
                    .replaceAll("%tab%", "\n")
                    .replaceAll("%desc%", interaction.options.getString("desc_en"))
                    .replaceAll("%1%", interaction.options.getString("option_1"))
                    .replaceAll("%2%", interaction.options.getString("option_2")))
                ]
            }).then(async (message) => {
                await message.react("1️⃣")
                await message.react("2️⃣")
                await database.set(`poll_${message.id}`, {
                    messageId: message.id,
                    description: interaction.options.getString("desc_en"),
                    options: [
                        interaction.options.getString("option_1"),
                        interaction.options.getString("option_2")
                    ],
                    authorId: interaction.member.id,
                    authorTag: interaction.user.tag,
                    language: "EN"
                })
            })
        })
        await interaction.editReply({
            embeds: [
                embeds.a
            ],
            ephemeral: true
        })
    } catch(e) {
        error("Error al enviar una encuesta. Stacktrace:")
        console.error(e)
        await interaction.editReply({
            embeds: [
                embeds.b
            ]
        })
    }
  }
};