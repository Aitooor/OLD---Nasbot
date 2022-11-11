const { config } = require("../index.js")

module.exports = async (client, interaction) => {

    await interaction.deferUpdate()

    for (const rol of config.verification.verified_roles) {
        await interaction.member.roles.add(rol)
    }

}
