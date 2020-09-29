#!/usr/bin/env node
const { program } = require('commander')
const { printLog } = require('../libs/log')
//export version
program.version(printLog(require('../package').version), '-v')

//use pepper create <project-name> to create a project
program.command('create','create a react project')

program.parse(process.argv);
