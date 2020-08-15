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
const generateEjs = (filename, output, options) => {
  if (typeof filename != 'string') {
    throw new Error(printError(`${filename} is not string`))
  }
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output)
  }

  const o = path.parse(filename)
  const { outputPath, ejs, merge } = options
  let baseName = o.name
  if (/\.json$/.test(o.ext)) {
    o.name+='_JSON_'
  }
  try {
    if (merge) {
      const baseFile = fileContent(filename)
      o.base = ''
      o.ext = '.ejs'
      o.dir = ejs
      const extraFile = fileContent(path.format(o))
      let outputData = Object.assign(baseFile, extraFile);
      o.name = baseName

      let fo = Object.create(null)
      fo.data = outputData
      fo.path = outputPath
      fs.writeFileSync(path.resolve(output, `${o.name}${o.ext}`), JSON.stringify(fo, null, 2))
    } else {
      let fo = Object.create(null)
      fo.data = fs.readFileSync(filename, {encoding: 'utf-8'})
      fo.path = outputPath
      fs.writeFileSync(path.resolve(output, `${o.name}${o.ext}`), JSON.stringify(fo, null, 2))
    }
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

  try {
    let d = fs.readdirSync(rootDir, {
      withFileTypes: true
    })
    d.forEach(item => {
      if (item.isFile() && /\.ejs$/.test(item.name) ) {
        //处理文件
        let data = fs.readFileSync(path.resolve(rootDir,item.name), {
          encoding: 'utf-8'
        })
        transfer(ejs.render(data, ejsData), /_JSON_/.test(item.name))
      } else if (item.isDirectory()) {
        compileEjs(path.resolve(rootDir, item.name), ejsData)
      }
    })
  } catch (error) {
    throw new Error(error)
  }
}

const transfer = (item, isJSON) => {
  if (isJSON) {
    item = JSON.parse(item)
    const { data, path } = item
  }

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
