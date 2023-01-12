const { database } = require("../database/database.js")

module.exports = function() {
    return {
        isPoll: function(id) {
            return database.has(`poll_${id}`)
        }
    }
}();