const program = require('commander')
const fs = require('fs')
const path = require('path')
const cmd = require('../libs/cmd')
const { printError, printInfo } = require('../libs/log')
const spinner = require('../libs/loading')

program
.name("gnr create")
.usage('your-project-name>').parse(process.argv)

// 根据输入，获取项目名称
let projectName = program.args[0]

if (!projectName) {  // project-name 必填
  program.help()
  return
}

//检查项目是否存在
const checkProject = () => {
  const dir = fs.readdirSync(process.cwd())
  if (dir.includes(projectName)) {
    printError(`${projectName} is already in current dir`)
  }
  return;
}

//进行创建
const create = async () => {
  //获取选项结果
  // const chooseResult = await cmd()
  // chooseResult.unshift({ projectName: projectName })
  const rootDir = path.resolve(process.cwd(), projectName)
  //创建目录
  fs.mkdirSync(rootDir)
  spinner.start()
  //TODO:复制目录

}
checkProject()
create()
