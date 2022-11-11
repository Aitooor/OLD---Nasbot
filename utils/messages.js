const { config } = require("../index.js")

function checkLanguage(member) {
    if(member.roles.cache.has(config.verification.es_rol)) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    checkLanguage
}
