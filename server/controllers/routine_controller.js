const refreshTokenController = require('./refreshTokenController')
const findUserByRefreshToken = require('../database/findUser').findUserByRefreshToken
const saveUserInfo = require('../database/save').saveUserInfo

function createNewRoutine(user,routineInfo){
    console.log(routineInfo)
    let newRoutine = {date:routineInfo.date,exercises:routineInfo.exercises,reps:routineInfo.reps}
    user.routines.push(newRoutine)  
    saveUserInfo()    
}

function updateRoutine(req,res){
    const cookies = req.cookies;
     if (!cookies?.jwt) return res.sendStatus(401);
     const refreshToken = cookies.jwt;
     const foundUser = findUserByRefreshToken(refreshToken)
     const isValidToken = refreshTokenController.verifyToken(foundUser,refreshToken) 
    if(!isValidToken) return res.sendStatus(403)
        console.log(req.body.newRoutine)
    const formatedRoutine =  req.body.newRoutine.routine.map(ex=>{return ex.id})
    const formatedReps =  req.body.newRoutine.routine.map(ex=>{return ex.reps})
    console.log(req.body.newRoutine.routine.reps)
    // when a routine does not currently exist at a particular date it is made here
    if (req.body.newRoutine.index == undefined) createNewRoutine(foundUser,{date:req.body.newRoutine.date,exercises:formatedRoutine,reps:formatedReps})
   
    // if a routine has no exercises in it delete it
    else if (formatedRoutine.length == 0) {
        foundUser.routines[req.body.newRoutine.index] = foundUser.routines[foundUser.routines.length - 1]; // Replace with last element
        foundUser.routines.pop(); // Remove the last element
    }
    //if the routine is just updated to something else
  else{
    foundUser.routines[req.body.newRoutine.index].exercises = formatedRoutine
    foundUser.routines[req.body.newRoutine.index].reps = formatedReps
    }
    saveUserInfo()
    return res.status(200).json({routines:foundUser.routines})
}

module.exports={updateRoutine}