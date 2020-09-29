const program = require('commander')
const fs = require('fs')
const path = require('path')
const download = require('download-git-repo')
const cmd = require('../libs/cmd')
const { printError, printInfo, printLog } = require('../libs/log')
const spinner = require('../libs/loading')
const { removeDir } = require('../libs/utils')

const remoteRepo = fs.readFileSync(path.resolve(__dirname, '../repo') , {encoding:'utf-8'})

program
.name("pepper create")
.option('-f --fast', 'create a quick start project')
.usage('your-project-name>').parse(process.argv).parseOptions(process.argv)


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
    console.log(printError(`error: ${projectName} is already in current dir`))
    return false;
  } else {
    return true
  }
}

//进行创建
const create = async () => {
  //获取选项结果
  let chooseResult = await cmd()
  chooseResult.unshift({ projectName: projectName })
  let result = {}
  chooseResult.forEach(data => {
    result = Object.assign(result, data)
  })

  const rootDir = path.resolve(process.cwd(), projectName)
  const spin = spinner()
  spin.start(printLog('download file from remote...'))
  try {
    //1.从远程仓库下载
    await downloadRepo(remoteRepo, rootDir)
    spin.succeed(printLog('download file success'))
    spin.start(printLog('compile files...'))

    const initiation = require(path.resolve(rootDir,'config/config.js'))

    initiation(result)
    spin.succeed(printLog(`create ${projectName} successful!`))
    console.log('\n', printInfo(`cd ${projectName} & yarn to start this project`))
  } catch (error) {
    //移除文件夹下的所有内容
    try {
      removeDir(rootDir, true)
    } catch (error) {

    }
    console.log(error)
    spin.fail(printError(error + '\n' + 'error to create project'))
  }
}

const downloadRepo = async (source, dist) => {
  return new Promise((resolve,reject) => {
    download(source, dist, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })

}
if (checkProject()) {
  create()
}

