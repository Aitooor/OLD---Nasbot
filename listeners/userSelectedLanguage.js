const { ActionRowBuilder, ButtonBuilder } = require("discord.js")
const { config, messages } = require("../index.js")

module.exports = async (client, interaction, language) => {

    await interaction.deferReply({
        ephemeral: true
    })

    switch(language) {
        case "ES":
            await interaction.member.roles.add(config.verificacion.es_rol)
            break;
        case "EN":
            await interaction.member.roles.add(config.verificacion.en_rol)
            break;
        case "ESN":
            await interaction.member.roles.add(config.verificacion.es_rol)
            await interaction.member.roles.add(config.verificacion.en_rol)
            break;
    }

    await interaction.editReply({
        embeds: [
            messages.verification
        ],
        components: [
            new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel(config.verificacion.button_verify.label)
                .setEmoji(config.verificacion.button_verify.emoji)
                .setStyle(config.verificacion.button_verify.color)
                .setCustomId("verify")
            )
        ]
    })

}