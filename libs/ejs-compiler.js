const fs = require('fs')
const path = require('path')
/**
 * usage resolveEjsFiles(path.join(__dirname,'../pkg/_ejs_build_/'))
 * 查找某一个目录下的所有文件，找到.ejs后缀的名字，并且替换模版，转化成相应的格式
 */

const resolveEjsFiles = async (rootDir = path.resolve('/')) => {
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
        let result = JSON.parse(data);
        if (result && result.data) {
          transfer(result);
        }
      } else if (item.isDirectory()) {
        resolveEjsFiles(path.resolve(rootDir, item.name))
      }
    })
  } catch (error) {
    console.error(error)
  }
}

const transfer = (item) => {
  const { data, path } = item
  try {
    let str = JSON.stringify(data, null, 2)
    fs.writeFileSync(path, str, {encoding:'utf-8'})
  } catch (error) {
    console.error(error)
  }
}

module.exports = resolveEjsFiles
