const program = require('commander')
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const download = require('download-git-repo')
const cmd = require('../libs/cmd')
const { printError, printInfo, printLog } = require('../libs/log')
const spinner = require('../libs/loading')
const { copyDir, generateEjs, compileEjs, removeDir } = require('../libs/utils')

const remoteRepo = 'https://github.com:keysinandy/webpack-react#template'

program
.name("gnr create")
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
  const chooseResult = await cmd()
  chooseResult.unshift({ projectName: projectName }, {fast: program.fast})
  let ejsData = resolveResult(chooseResult)
  const rootDir = path.resolve(process.cwd(), projectName)
  const spin = spinner()
  spin.start(printLog('download file from remote...'))
  try {
    //1.从远程仓库下载
    await downloadRepo(remoteRepo, rootDir)
    spin.succeed(printLog('download file success'))
    spin.start(printLog('compile files...'))
    //2.读取配置文件
    const configStr = await ejs.renderFile(path.resolve(__dirname, 'config.ejs'), ejsData, {async: true})
    let config = JSON.parse(configStr)
    //3.编译成ejs文件
    let filesCompile = config.filesCompile;
    filesCompile.forEach(item => {
      const {filename, output, ejs, merge } = item
      generateEjs(path.resolve(rootDir, filename), path.resolve(rootDir, '_ejs_build_'), {output: path.resolve(rootDir, outputPath), ejs: path.resolve(rootDir, ejs), merge})
    });
    //4.把ejs覆盖为相应的文件
    //TODO:修改ejsData,使其对应文件
    compileEjs(path.resolve(rootDir, '_ejs_build_'), ejsData)
    //5.删除对应文件夹
    let dirRemove = config.dirRemove
    dirRemove.forEach(item => {
      removeDir(path.resolve(rootDir, item), true)
    })
    spin.succeed(printLog(`create ${projectName} successful!`))
    console.log('\n', printInfo(`cd ${projectName} & yarn to start this project`))
  } catch (error) {
    //移除文件夹下的所有内容
    removeDir(rootDir, true)
    spin.fail(printError(error + '\n' + 'error to create project'))
  }
}

const resolveResult = (result) => {

  let data = Object.create(null)
  result.map(v => {
    data = Object.assign(data,v)
  })
  return data
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

