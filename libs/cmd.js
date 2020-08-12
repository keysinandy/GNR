const inquirer = require('inquirer')
const { printInfo} = require('./log')

// 设置问题
const questions = [
  {
    type: 'input',
    name: 'author',
    message: printInfo('input your name and email here'),
    default: ""
  },
  {
    type: 'version',
    name: 'version',
    message: printInfo('your project version'),
    default: "0.0.1"
  },
]

 const select = async () => {
  let len = questions.length
  let index = 0
  let answers = []
  while (index < len) {
    const result = await inquirer.prompt(questions[index])
    answers.push(result)
    index++
  }
  return answers
}

module.exports = select
// select().then(console.log)
