const { SlashCommandBuilder } = require("discord.js")
const { config } = require("../index.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('num')
        .setDescription(config.commands.num.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.num.en,
            EnglishGB: config.commands.num.en
        })
        .addIntegerOption(option => option
            .setName("min")
            .setDescription("Escribe número mínimo.")
            .setRequired(true))
        .addIntegerOption(option => option
            .setName("max")
            .setDescription("Escribe el número máximo")
            .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply();

        await interaction.editReply({
            content: `${Math.floor(Math.random() * (interaction.options.getInteger("max") - interaction.options.getInteger("min") + 1)) + interaction.options.getInteger("min")}`
        })

    }
};