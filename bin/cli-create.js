const program = require('commander')
const cmd = require('../libs/cmd')
const { printError } = require('../libs/log')
program
.name("gnr create")
.usage('your-project-name>').parse(process.argv)

// 根据输入，获取项目名称
let projectName = program.args[0]

if (!projectName) {  // project-name 必填
  // 相当于执行命令的--help选项，显示help信息，这是commander内置的一个命令选项
  program.help()
  return
}

//检查项目是否存在
const checkProject = async () => {
  const dir = await fs.readdirSync(process.cwd())
  if (dir.includes(projectName)) {
    printError(`${projectName} is already in current dir`)
  }
  return;
}

//进行创建
const create = async () => {
  const chooseResult = await cmd()
  chooseResult.unshift({projectName: projectName})
  console.log(chooseResult)
}
checkProject()
create()
