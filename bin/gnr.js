#!/usr/bin/env node
const { program } = require('commander')
const { printLog } = require('../libs/log')
//输出版本号
program.version(printLog(require('../package').version), '-v')

program.command('create','create a react project')

program.parse(process.argv);
