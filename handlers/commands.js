const { Collection } = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { readdirSync } = require("fs")
const { log, error } = require("../logs.js")
const { config, messages, messagesEn } = require("../index.js")
const { checkLanguage } = require("../utils/messages.js")

module.exports = (client) => {
client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if(!command) return;
    try {

        checkLanguage(interaction.member) ?
        emb = {
            a: messages.no_permission,
            b: "Ocurrió un error al ejecutar este comando. Pídele a un administrador que revise la consola."
        }
        :
        emb = {
            a: messagesEn.no_permission,
            b: "An error has ocurred while trying to execute this command, please ask a server admin to check the console."
        }

        if(!config.commands[interaction.commandName].rol.some(rol => interaction.member.roles.cache.has(rol))) {
            return await interaction.reply({
                embeds: [
                    emb.a
                ],
                ephemeral: true
            })
        }

        await command.execute(interaction);

    } catch(error) {
        if(error) console.error(error);
        try {
            await interaction.reply({ content: emb.b, ephemeral: true });
        } catch(e) {
            await interaction.editReply({ content: emb.b, ephemeral: true });
        }
    }
})

client.on("ready", async () => {
  try {
    client.commands = new Collection();
    const comandos = [];

    for (const file of readdirSync("./commands").filter(f => f.split(".").pop() === "js")) {
    const comando = require(`../commands/${file}`);
    comandos.push(comando.data.toJSON());
    client.commands.set(comando.data.name, comando);
    }

    const rest = new REST({ version: '9'}).setToken(client.token);
      (async () => {
          try {
            await rest.put(Routes.applicationGuildCommands(client.user.id, config.serverId), { body: comandos } );
            await rest.put(Routes.applicationCommands(client.user.id), { body: [] })
             log("Slash commands cargados")
          } catch(e) {
              error("Hubo un error al cargar uno o varios comandos. Stacktrace:")
              console.error(e);
          }
      })();

      log("Evento cargado: READY")
  } catch(e) {
        error("Evento no cargado: READY. Stacktrace:")
        console.error(e)
  }
})
}
