const inquirer = require('inquirer')
const chalk = require('chalk')

const PrintInfo = (message) => {
  return chalk.hex('#87d068')(message)
}
const PrintError = (message) => {
  return chalk.hex('#cd201f')(message)
}
const PrintWarn = (message) => {
  return chalk.hex('#f0af41')(message)
}
const PrintLog = (message) => {
  return chalk.hex('#4091f7')(message)
}

// 设置问题
inquirer.prompt([
  {
    type: 'input',
    name: 'project_name',
    message: PrintInfo('input your project name'),
    default: 'GNR-Demo'
  },
]).then( answers =>{
  // 处理结果
  console.log(`你的名字: `, answers.name)

} )
