const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('flipcoin')
        .setDescription(config.commands.flipcoin.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.flipcoin.en,
            EnglishGB: config.commands.flipcoin.en
        }),
    async execute(interaction) {

        await interaction.deferReply();

        checkLanguage(interaction.member) ?
            embeds = {
                a: messages.flipcoin
            }
            :
            embeds = {
                a: messagesEn.flipcoin   
            };

        var options = [
            {
                name: "Cara",
                img: "https://rollthedice.online/assets/images/upload/dice/dado-cara-cruz/cara_moneda.png"
            },
            {
                name: "Cruz",
                img: "https://rollthedice.online/assets/images/upload/dice/dado-cara-cruz/cruz_moneda.png"
            },
        ]
        
        var random = options[Math.floor(Math.random() * options.length)];

        await interaction.editReply({
            embeds: [
                JSON.parse(JSON.stringify(embeds.a)
                .replace("%value%", random.name)
                .replace("%img%", random.img))
            ]
        })
    }
};