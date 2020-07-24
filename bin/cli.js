#!/usr/bin/env node
const { program } = require('commander')

//输出版本号
program.version(require('../package').version, '-v')

//获取帮助
program.option('-h, --help', 'output help')

if (program.help) {
  console.log("output help")
}

program.parse(process.argv);
