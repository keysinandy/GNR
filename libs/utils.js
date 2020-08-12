const fs = require('fs')
const path = require('path')
const child_process = require('child_process')
const ejs = require('ejs')
const { printError } = require('../libs/log')
//复制目录
function copyDir(src, dest, direct) {
  if(!direct) {
    src = path.join(__dirname, src)
    dest = path.join(__dirname, dest)
  }

  if (fs.existsSync(src)) {
    child_process.spawnSync('cp', ['-r', src, dest])
  } else {
    throw new Error(error)
  }
}

//删除目录
const removeDir = (dir, direct) => {
  if(!direct) {
    dir = path.join(__dirname, dir)
  }

  if (fs.existsSync(dir)) {
    child_process.spawnSync('rm', ['-rf', dir])
  } else {
    throw new Error(error)
  }
}

/**
 * usage generateEjs()
 *
 * 将正常文件与模版文件合并输出到_ejs_build_目录下
 */
const generateEjs = (rootDir, filename, options) => {
  if (typeof filename != 'string') {
    throw new Error(printError(`${filename} is not string`))
  }
  fs.mkdirSync(path.resolve(rootDir, '_ejs_build_'))
  const o = path.parse(filename)
  const { filePath } = options
  try {
    const baseFile = fileContent(filename)

    let baseName = o.name
    o.base = ''
    o.name += '_EJS_'
    o.ext = '.ejs'
    o.dir += '/ejs'
    const extraFile = fileContent(path.format(o))
    let output = Object.assign(baseFile, extraFile);
    o.name = baseName

    let fo = Object.create(null)
    fo.data = output
    fo.path = filePath
    fs.writeFileSync(path.resolve(rootDir, `_ejs_build_/${o.name}${o.ext}`), JSON.stringify(fo, null, 2))
  } catch (error) {
    throw new Error(error)
  }
}

const fileContent = (filename) => {
  try {
    let data = fs.readFileSync(filename, {encoding: 'utf-8'})
    return JSON.parse(data)
  } catch (error) {
    Object.create(null)
  }
}
/**
 *
 * 查找某一个目录下的所有文件，找到.ejs后缀的名字，并且替换模版，转化成相应的格式
 */

const compileEjs = (rootDir, ejsData) => {
  let ejsPath = path.resolve(rootDir, '_ejs_build_')
  try {
    let d = fs.readdirSync(ejsPath, {
      withFileTypes: true
    })
    d.forEach(item => {
      if (item.isFile() && /\.ejs$/.test(item.name) ) {
        //处理文件
        let data = fs.readFileSync(path.resolve(ejsPath,item.name), {
          encoding: 'utf-8'
        })
        let result = JSON.parse(data);
        if (result && result.data) {
          transfer(ejs.render(JSON.stringify(result, null, 2) , ejsData))
        }
      } else if (item.isDirectory()) {
        compileEjs(path.resolve(ejsPath, item.name), ejsData)
      }
    })
  } catch (error) {
    throw new Error(error)
  }
}

const transfer = (item) => {
  item = JSON.parse(item)
  const { data, path } = item
  try {
    let str = JSON.stringify(data, null, 2)
    fs.writeFileSync(path, str, {encoding:'utf-8'})
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  compileEjs,
  generateEjs,
  copyDir,
  removeDir,
}
