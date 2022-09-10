const DatabaseFramework = require("easy-json-database");
const database = new DatabaseFramework("./database.json", {
    snapshots: {
        enabled: true,
        interval: 24 * 60 * 60 * 1000,
        folder: './database-backups/'
    }
});

module.exports = {
    database
}
