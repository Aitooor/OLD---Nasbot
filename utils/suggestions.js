const { database } = require("../database/database.js")

module.exports = function() {
    return {
        isSuggestion: function(id) {
            return database.has(`suggestion_${id}`)
        }
    }
}();