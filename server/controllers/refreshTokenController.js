const jwt = require('jsonwebtoken');
const data = require('../userdata.json')
require('dotenv').config();

function findUser(refreshToken){
    function equal_to(current_user){
        if (current_user.refreshToken == refreshToken) return true
    }
    var results = data.find(equal_to)
    return results
}

function verifyToken(foundUser, refreshToken) {
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        return foundUser.id === decoded.user;
    } catch (err) {
        return false;
    }
}
const handleRefreshToken = (req, res) => {
    
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    const foundUser = findUser(refreshToken);
    if (!foundUser) return res.sendStatus(403); //Forbidden 
    const isValidToken = verifyToken(foundUser,refreshToken)
    if(!isValidToken) return res.sendStatus(403);
    const accessToken = jwt.sign(
        { "user": foundUser.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30s' }
    );
    res.json({ user:foundUser.id,routines:foundUser.routines,accessToken })
}

module.exports = { handleRefreshToken,verifyToken }