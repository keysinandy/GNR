const ora = require('ora');
const { printLog } = require('./log')
const spinner = (text) => ora({
  text: printLog(String(text)),
  interval: 80
})

module.exports = spinner
