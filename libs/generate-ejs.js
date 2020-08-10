const fs = require('fs')
const path = require('path');

/**
 * usage generate(path.join(__dirname,'/package.json'), {filePath: path.resolve(process.cwd(), 'package.json')} )
 * 将正常文件与模版文件合并输出到_ejs_build_目录下
 */

const generate = async (filename, options) => {
  if (typeof filename != 'string') {
    console.warn(`${filename} is not string`)
    return;
  }
  const o = path.parse(filename)
  const { filePath } = options
  try {
    const baseFile = await fileContent(filename)

    let baseName = o.name
    o.base = ''
    o.name += '_EJS_'
    o.ext = '.ejs'

    const extraFile = await fileContent(path.format(o))

    let output = Object.assign(baseFile, extraFile);
    o.name = baseName

    let fo = Object.create(null)
    fo.data = output
    fo.path = filePath
    fs.writeFileSync(path.join(__dirname, `../pkg/_ejs_build_/${o.name}${o.ext}`), JSON.stringify(fo, null, 2))
  } catch (error) {
    console.error(error)
  }
}

const fileContent = async (filename) => {
  return new Promise((resolve,reject) => {
    fs.readFile(filename, {encoding: 'utf-8'}, (err, data) => {
      if (err) {
        console.error(err)
        resolve(Object.create(null))
      } else {
        resolve(JSON.parse(data))
      }
    })
  }).catch(e => {
    console.error(e)
  })
}

module.exports = generate
