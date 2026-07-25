const data = require('../userdata.json')

function findUserByID(user){
    function equal_to(current_user){
        if (current_user.id.toLowerCase() == user) return true
    }
    var result = data.find(equal_to)
    return result
}
function findUserByRefreshToken(refreshToken){
    function equal_to(current_user){
        if (current_user.refreshToken == refreshToken) return true
    }
    var results = data.find(equal_to)
    return results
}
module.exports={findUserByID,findUserByRefreshToken}