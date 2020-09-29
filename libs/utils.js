const fs = require('fs')
const path = require('path')
const child_process = require('child_process')
//复制目录
function copyDir(src, dest, direct) {
  if(!direct) {
    src = path.join(__dirname, src)
    dest = path.join(__dirname, dest)
  }

  if (fs.existsSync(src)) {
    child_process.spawnSync('cp', ['-r', src, dest])
  } else {
    throw new Error(`copyDir failed ${src} not exist`)
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
    throw new Error(`removeDir failed ${dir} not exist`)
  }
}


module.exports = {
  copyDir,
  removeDir,
}
