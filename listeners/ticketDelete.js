const { database } = require("../database/database")

module.exports = async (client, interaction) => {
    
    await database.delete(`ticket_${interaction.channel.id}`)

    await interaction.channel.delete()

}