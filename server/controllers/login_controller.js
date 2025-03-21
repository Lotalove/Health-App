const data = require('../userdata.json')
const jwt = require('jsonwebtoken') //
const argon2 = require('argon2') // for encryption
require('dotenv').config();
const fs= require('fs')
const findUserByID = require('../database/findUser').findUserByID

async function createTokens(user){
   const accessToken = jwt.sign({user:user},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15m'}) 
   const refreshToken = jwt.sign({user:user},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'1d'})
    //writes the refresh token
   findUserByID(user).refreshToken = refreshToken
    fs.writeFileSync('./userdata.json',JSON.stringify(data,null,2))
    return {accessToken,refreshToken}
}

// todo send back an error message for errors!
async function login(req,res){
    try{
    const user = findUserByID(req.body.user)
    const match = await argon2.verify(user.password,req.body.password)
    
    if (match){
        const tokens = await createTokens(user.id)
        res.cookie('jwt',tokens.refreshToken,{httpOnly:true, maxAge:24*60*60*1000})
        res.status(200).json({user:user.id,routines:user.routines,accessToken:tokens.accessToken})  
    } 
    else res.status(400).json({})
}
catch (err){
    console.log(err)
}
}

module.exports ={login}