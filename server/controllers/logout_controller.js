const fs= require('fs')
const data = require('../userdata.json')

async function deleteTokens(user){
   findUser(user).refreshToken = ''
    fs.writeFileSync('./userdata.json',JSON.stringify(data,null,2))
}

function findUser(user){
    function equal_to(current_user){
        if (current_user.id.toLowerCase() == user) return true
    }
    var results = data.find(equal_to)
    return results
}

const logout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    
    const foundUser = findUser(req.body.user);
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    deleteTokens(foundUser.id)

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}

module.exports = { logout }