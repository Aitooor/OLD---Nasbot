const { writeFile } = require("fs");
const chalk = require('chalk');

function log(text) {
    var log = `[${new Date().toLocaleString('es-ES')}] - [INFO] ${text}`
    console.log(chalk.green.bold(log))
    writeFile('./logs/log.txt', log + "\r\n", { flag: 'a+' }, error => {
        if(error) console.error(error);
    });
}

function error(err) {
    var log = `[${new Date().toLocaleString('es-ES')}] - [ERROR] ${err}`
    console.log(chalk.red.bold(log));
    writeFile('./logs/errors.txt', log + "\r\n", { flag: 'a+' }, error => {
        if(error) console.error(error);
    });
}

module.exports = {
    log,
    error
}