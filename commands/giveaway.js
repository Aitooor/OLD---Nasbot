const { SlashCommandBuilder } = require("discord.js")
const { config, messages, messagesEn, giveawayManager } = require("../index.js")
const ms = require("ms");
const { checkLanguage } = require("../utils/messages.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription("Sorteos")
        .addSubcommand(s => s
            .setName("start")
            .setDescription(config.commands["giveaway start"].es)
            .setDescriptionLocalizations({
                EnglishUS: config.commands["giveaway start"].en,
                EnglishGB: config.commands["giveaway start"].en
            })
            .addChannelOption(option => option
                .setName("canal")
                .setDescription("El canal dónde se enviará el sorteo")
                .setRequired(true))
            .addStringOption(option => option
                .setName("duracion")
                .setDescription("Duración del sorteo.")
                .setRequired(true))
            .addIntegerOption(option => option
                .setName("ganadores")
                .setDescription("Número de ganadores que se eligirán")
                .setRequired(true))
            .addStringOption(option => option
                .setName("premio")
                .setDescription("El premio que se sortea")
                .setRequired(true)))
        .addSubcommand(s => s
            .setName("end")
            .setDescription(config.commands["giveaway end"].es)
            .setDescriptionLocalizations({
                EnglishUS: config.commands["giveaway end"].en,
                EnglishGB: config.commands["giveaway end"].en
            })
            .addStringOption(option => option
                .setName("id")
                .setDescription("La ID del sorteo")
                .setRequired(true)))
        .addSubcommand(s => s
            .setName("reroll")
            .setDescription(config.commands["giveaway reroll"].es)
            .setDescriptionLocalizations({
                EnglishUS: config.commands["giveaway reroll"].en,
                EnglishGB: config.commands["giveaway reroll"].en
            })
            .addStringOption(option => option
                .setName("id")
                .setDescription("La ID del sorteo")
                .setRequired(true))
            .addIntegerOption(option => option
                .setName("ganadores")
                .setDescription("Cantidad de ganadores que se escogerán")
                .setRequired(true))),
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true
        })

        checkLanguage(interaction.member) ?
        embeds = {
            a: messages.usage_mute,
            b: messages.invalid_number,
            c: messages.giveaway_started,
            d: messages.giveaway_not_found,
            e: messages.giveaway_ended,
            f: messages.giveaway_inactive,
            g: messages.giveaway_reroll
        }
        :
        embeds = {
            a: messagesEn.usage_mute,
            b: messagesEn.invalid_number,
            c: messagesEn.giveaway_started,
            d: messagesEn.giveaway_not_found,
            e: messagesEn.giveaway_ended,
            f: messagesEn.giveaway_inactive,
            g: messagesEn.giveaway_reroll    
        };
    
    if(interaction.options.getSubcommand() === "start") {
                
        let canal = interaction.options.getChannel("canal");
        let duracion = interaction.options.getString("duracion");
        let ganadores = interaction.options.getInteger("ganadores");
        let premio = interaction.options.getString("premio");

        if(!ms(duracion)) {
            return await interaction.editReply({
                embeds: [
                    embeds.a
                ]
            })
        }

        if(ganadores <= 0) {
            return await interaction.editReply({
                embeds: [
                    embeds.b
                ]
            })
        }

        await giveawayManager.start(canal, {
            duration: ms(duracion),
            winnerCount: ganadores,
            prize: premio,
            hostedBy: interaction.member.user,
            messages: {
                giveaway: config.giveaways.embed.content,
                giveawayEnded: config.giveaways.embedend.content,
                drawing: config.giveaways.embed.ends,
                dropMessage: config.giveaways.embed.reacciona,
                inviteToParticipate: config.giveaways.embed.reacciona,
                winMessage: config.giveaways.messages.winners,
                embedFooter: config.giveaways.embed.footer,
                noWinner: config.giveaways.messages.cancelled,
                hostedBy: config.giveaways.embed.hostedby,
                winners: config.giveaways.embedend.winners,
                endedAt: config.giveaways.embedend.time
            }
        })
        .then(async () => {
            await interaction.editReply({
                embeds: [
                    JSON.parse(JSON.stringify(embeds.c)
                    .replace("%canal%", canal)
                    .replace("%duracion%", duracion)
                    .replace("%premio%", premio)
                    .replace("%ganadores%", ganadores))
                ]
            })
        })
    } else if(interaction.options.getSubcommand() === "end") {
        const sorteo =giveawayManager.giveaways.find(sorteo => sorteo.messageId === interaction.options.getString("id"));

        if(!sorteo) {
            return await interaction.editReply({
                embeds: [
                    embeds.d
                ]
            })
        }

        await giveawayManager.end(interaction.options.getString("id"))
        .then(async () => {
            await interaction.editReply({
                embeds: [
                    embeds.e
                ]
            })
        })
        .catch(async (e) => {
            await interaction.editReply({
                embeds: [
                    embeds.f
                ]
            }) 
        })
    } else if(interaction.options.getSubcommand() === "reroll") {
        const sorteo = giveawayManager.giveaways.find(sorteo => sorteo.messageId === interaction.options.getString("id"));

        if(!sorteo) {
            return await interaction.editReply({
                embeds: [
                    embeds.d
                ]
            })
        }
        if(interaction.options.getInteger("ganadores") <= 0) {
            return await interaction.editReply({
                embeds: [
                    embeds.b
                ]
            })
        }


        await giveawayManager.reroll(interaction.options.getString("id"), {
            winnerCount: interaction.options.getInteger("ganadores"),
            messages: {
                congrat: config.giveaways.messages.reroll,
                error: config.giveaways.messages.notenoughmembers
            }
        })
        .then(async () => {
            await interaction.editReply({
                embeds: [
                    embeds.g
                ]
            })
        })
    }
  }
};
