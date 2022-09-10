const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banlist')
        .setDescription(config.commands.banlist.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.banlist.en,
            EnglishGB: config.commands.banlist.en
        }),
    async execute(interaction) {

        await interaction.deferReply();

        checkLanguage(interaction.member) ?
        embeds = {
            a: messages.banlist
        }
        :
        embeds = {
            a: messagesEn.banlist  
        };

        await interaction.guild.bans.fetch()
        .then(async (banList) => {
            let map = banList.map(user => user.user.username).join("\\n");
            if(map.length >= 1000) map = `${map.slice(0, 1000)}...`
            await interaction.editReply({
                embeds: [
                    JSON.parse(JSON.stringify(embeds.a)
                    .replace("%bans%", banList.size)
                    .replace("%list%", map))
                ]
            })
        })
    }
};