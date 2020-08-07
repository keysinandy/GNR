let ejs = require('ejs')

const fn = () => ejs.renderFile('./package.ejs',{name:123}).then(res=>{
  console.log(res)
})
fn()
