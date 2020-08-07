const ora = require('ora');
const { printLog } = require('./log')
const spinner = ora({
  text: printLog('download from remote repo...'),
  interval: 80
})

module.exports = spinner
