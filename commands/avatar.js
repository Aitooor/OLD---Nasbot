const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription(config.commands.avatar.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.avatar.en,
            EnglishGB: config.commands.avatar.en
        })
        .addUserOption(option => option
            .setName("usuario")
            .setDescription("Elige el usuario del que se mostrará su avatar. Si no eliges ninguno se mostrará el tuyo.")),
    async execute(interaction) {

        await interaction.deferReply();

        checkLanguage(interaction.member) ?
        embeds = {
            a: messages.avatar
        }
        :
        embeds = {
            a: messagesEn.avatar   
        };

        var user = interaction.user;
        if(interaction.options.getUser("usuario")) user = interaction.options.getUser("usuario");

        await interaction.editReply({
            embeds: [
                JSON.parse(JSON.stringify(embeds.a)
                .replace("%tag%", user.tag)
                .replace("%image%", user.displayAvatarURL({ dynamic: true, size: 2048 })))
            ]
        })
    }
};