

module.exports = async (client, interaction) => {
    if(interaction.isCommand()) return;

    switch(interaction.customId) {
        case "verifyES":
            await client.emit("userSelectedLanguage", interaction, "ES")
            break;
        case "verifyEN":
            await client.emit("userSelectedLanguage", interaction, "EN")
            break;
        case "verifyESN":
            await client.emit("userSelectedLanguage", interaction, "ESN")
            break;
        case "verify":
            await client.emit("userVerified", interaction)
            break;
        case "ticketCreateES":
            await client.emit("ticketCreate", interaction, "ES")
            break;
        case "ticketCreateEN":
            await client.emit("ticketCreate", interaction, "EN")
            break;
        case "ticketSelectedCategoryES":
            await client.emit("ticketSelectCategory", interaction, "ES")
            break;
        case "ticketSelectedCategoryEN":
            await client.emit("ticketSelectCategory", interaction, "EN")
            break;
        case "closeTicketES":
            await client.emit("closeTicket", interaction, "ES")
            break;
        case "closeTicketEN":
            await client.emit("closeTicket", interaction, "EN")
            break;
        case "callStaffES":
            await client.emit("ticketCallStaff", interaction, "ES")
            break;
        case "callStaffEN":
            await client.emit("ticketCallStaff", interaction, "EN")
            break;
        case "closeTicketCancel":
            await interaction.message.delete();
            break;
        case "closeTicketConfirmES":
            await client.emit("closeTicketConfirm", interaction, "ES")
            break;
        case "closeTicketConfirmEN":
            await client.emit("closeTicketConfirm", interaction, "EN")
            break;
        case "ticketDeleteES":
            await client.emit("ticketDelete", interaction)
            break;
        case "ticketDeleteEN":
            await client.emit("ticketDelete", interaction)
            break;
    }
}