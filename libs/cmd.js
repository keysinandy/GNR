const inquirer = require('inquirer')
const { printInfo} = require('./log')

// 设置问题
const questions = [
  {
    type: 'rawlist',
    name: 'style',
    message: printInfo('choose your style language'),
    choices: [
      {
        name: 'sass',
        value: 'sass'
      },
      {
        name: 'less',
        value: 'less'
      },
      {
        name: 'none',
        value: 'none'
      },
    ],
    default: 0
  },
  {
    type: 'confirm',
      name: 'useRedux',
      message: printInfo('use redux?'),
      default: true
  },
  {
    type: 'confirm',
      name: 'useRouter',
      message: printInfo('use react-router?'),
      default: true
  }
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
