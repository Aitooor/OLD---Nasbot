const { ActionRowBuilder, ButtonBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")

module.exports = async (client, interaction, language) => {

    await interaction.deferReply({
        ephemeral: true
    })

    switch(language) {
        case "ES":
            await interaction.member.roles.add(config.verificacion.es_rol)
            cnf = {
                a: messages.verification,
                b: config.verificacion.button_verify_es.label,
                c: config.verificacion.button_verify_es.emoji,
                d: config.verificacion.button_verify_es.color
            }
            break;
        case "EN":
            await interaction.member.roles.add(config.verificacion.en_rol)
            cnf = {
                a: messagesEn.verification,
                b: config.verificacion.button_verify_en.label,
                c: config.verificacion.button_verify_en.emoji,
                d: config.verificacion.button_verify_en.color
            }
            break;
        case "ESN":
            await interaction.member.roles.add(config.verificacion.es_rol)
            await interaction.member.roles.add(config.verificacion.en_rol)
            cnf = {
                a: messagesEn.verification,
                b: config.verificacion.button_verify_en.label,
                c: config.verificacion.button_verify_en.emoji,
                d: config.verificacion.button_verify_en.color
            }
            break;
    }

    await interaction.editReply({
        embeds: [
            cnf.a
        ],
        components: [
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel(cnf.b)
                .setEmoji(cnf.c)
                .setStyle(cnf.d)
                .setCustomId("verify")
            )
        ]
    })
}
