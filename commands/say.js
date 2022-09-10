const { SlashCommandBuilder } = require("discord.js")
const { config } = require("../index.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription(config.commands.say.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.say.en,
            EnglishGB: config.commands.say.en
        })
        .addStringOption(option => option
            .setName("texto")
            .setDescription("El texto que debo decir.")
            .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply();

        await interaction.channel.send({
            content: interaction.options.getString("texto").replaceAll("%tab%", "\n")
        })
        .then(async () => {
            await interaction.deleteReply()
        })
    }
};