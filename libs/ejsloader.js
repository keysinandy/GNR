const fs = require('fs')
const path = require('path')
//查找某一个目录下的所有文件，找到.ejs后缀的名字，并且替换模版，转化成相应的格式
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
        //TODO: transfer ejs to another file
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

const transfer = () => {

}
resolveEjsFiles(path.resolve('./ejsDir/'))
