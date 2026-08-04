const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyJWT=(req,res,next)=>{
    const authheader = req.headers['authorization']
    if(!authheader) return res.sendStatus(401)
        console.log(authheader) // bearer tokem
    const token = authheader.split(" ")[1]
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if (err) return res.sendStatus(403) //invalid session
        req.user = decoded.username
        next()
    })
}

module.exports = verifyJWT