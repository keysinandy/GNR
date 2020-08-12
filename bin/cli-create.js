const program = require('commander')
const fs = require('fs')
const path = require('path')
const cmd = require('../libs/cmd')
const { printError, printInfo, printLog } = require('../libs/log')
const spinner = require('../libs/loading')
const { copyDir, generateEjs, compileEjs, removeDir } = require('../libs/utils')

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
    console.log(printError(`${projectName} is already in current dir`))
    return false;
  } else {
    return true
  }
}

//进行创建
const create = async () => {
  //获取选项结果
  const chooseResult = await cmd()
  chooseResult.unshift({ projectName: projectName })
  let ejsData = resolveResult(chooseResult)
  const rootDir = path.resolve(process.cwd(), projectName)
  const spin = spinner()
  spin.start(printLog('starting generate files...'))
  try {
    //1.复制目录
    copyDir(path.resolve(__dirname, '../pkg'), rootDir, true)
    //2.读取配置文件
    const data = fs.readFileSync(path.resolve(__dirname, 'config.json'), {encoding: 'utf-8'})
    let config = JSON.parse(data)
    //3.编译成ejs文件
    let filesCompile = config.filesCompile;
    filesCompile.forEach(item => {
      generateEjs(path.resolve(rootDir, item), path.resolve(rootDir, '_ejs_build_'), {filePath: path.resolve(rootDir, item)})
    });
    //4.把ejs覆盖为相应的文件
    //TODO:修改ejsData,使其对应文件
    compileEjs(path.resolve(rootDir, '_ejs_build_'), ejsData)
    //5.删除对应文件夹
    let dirRemove = config.dirRemove
    dirRemove.forEach(item => {
      removeDir(path.resolve(rootDir, item), true)
    })
    spin.succeed(`create ${projectName} successful!`)
    console.log('\n', printInfo(`cd ${projectName} & yarn to start this project`))
  } catch (error) {
    //移除文件夹下的所有内容
    removeDir(rootDir, true)
    spin.fail('error, error to create project')
  }
}

const resolveResult = (result) => {

  let data = Object.create(null)
  result.map(v => {
    data = Object.assign(data,v)
  })
  return data
}
if (checkProject()) {
  create()
}

