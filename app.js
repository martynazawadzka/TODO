const yargs = require('yargs');
const commands = require('./commands');

commands.forEach(command => yargs.command(command));

yargs.help();
yargs.argv;
