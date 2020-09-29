const inquirer = require('inquirer')
const { printInfo} = require('./log')

// 设置问题
// TODO:检查格式
const questions = [
  {
    type: 'input',
    name: 'author',
    message: printInfo('input your name and email here'),
    default: "your-name <your-email-address@gmail.com>"
  },
  {
    type: 'input',
    name: 'repository',
    message: printInfo('input your repository here'),
    default:"git@github.com:your-username/project-name.git"
  },
  {
    type: 'input',
    name: 'version',
    message: printInfo('input your project version'),
    default: "0.0.1"
  },
  {
    type: 'confirm',
    name: 'useTypescript',
    message: printInfo('do you need typescript support?'),
    default: false
  },
  {
    type: 'confirm',
    name: 'fast',
    message: printInfo('faster to start a new project'),
    default: false
  },
]

 const select = async () => {
  let len = questions.length
  let index = 0
  let answers = []
  while (index < len) {
    const result = await inquirer.prompt(questions[index])
    answers.push(result)
    if (result.useTypescript) {
      break
    }
    index++
  }
  return answers
}

module.exports = select

