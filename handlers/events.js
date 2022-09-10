let { readdirSync } = require('fs'); 
const { error } = require("../logs.js")

module.exports = (client) => {
    for(const file of readdirSync('./listeners/')) { 
      if(file.endsWith(".js")) {
        let fileName = file.substring(0, file.length - 3); 
        let fileContents = require(`../listeners/${file}`);
       try {
         client.on(fileName, fileContents.bind(null, client))
       } catch(e) {
         error("Error al cargar el evento " + fileName + ". Stacktrace:")
         console.error(e)
      }
    }
  }
}
