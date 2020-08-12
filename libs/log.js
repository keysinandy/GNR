const chalk = require('chalk')

const printInfo = (message) => {
  return chalk.hex('#87d068')(message)
}
const printError = (message) => {
  return chalk.hex('#ee6b5f')(message)
}
const printWarn = (message) => {
  return chalk.hex('#f0af41')(message)
}
const printLog = (message) => {
  return chalk.hex('#4091f7')(message)
}
module.exports = {
  printInfo,
  printError,
  printWarn,
  printLog
}
