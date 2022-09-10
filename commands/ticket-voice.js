const { SlashCommandBuilder, ChannelType, PermissionsBitField } = require("discord.js")
const { config, messages, messagesEn } = require("../index.js")
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('voice')
        .setDescription(config.commands.voice.es)
        .setDescriptionLocalizations({
            EnglishUS: config.commands.voice.en,
            EnglishGB: config.commands.voice.en
        }),
    async execute(interaction) {

        await interaction.deferReply({
            ephemeral: true
        });

        checkLanguage(interaction.member) ?
        embeds = {
            a: messages.ticket_voice_created
        }
        :
        embeds = {
            a: messagesEn.ticket_voice_created   
        };

        await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username.toLowerCase()}`,
            parent: config.tickets_voice.parentId,
            userLimit: config.tickets_voice.userlimit,
            type: ChannelType.GuildVoice,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel]
                },
                {
                    id: interaction.member.id,
                    allow: [PermissionsBitField.Flags.Connect],
                },
                {
                    id: config.tickets_voice.staffRolId,
                    allow: [PermissionsBitField.Flags.Connect],
                }
            ]
        })
        .then(async (channel) => { 
        await interaction.editReply({
            embeds: [
                JSON.parse(JSON.stringify(embeds.a)
                .replace("%canal%", channel))
            ]
        })
    })
  }
};