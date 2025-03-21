const data = require('../userdata.json')
const fs= require('fs')

function saveUserInfo(){
    try{
        fs.writeFileSync('./userdata.json',JSON.stringify(data,null,2))
    } 
    catch(err){
        console.log(err)
    }
}

module.exports={saveUserInfo}