require('dotenv').config(); // must be first, before other requires
const Express = require("express")
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const server = Express()
const PORT = 3001
const auth_controller = require("./controllers/auth_controller")
const logoutController = require('./controllers/logout_controller')
const refreshTokenController = require('./controllers/refreshTokenController');
const routineController = require('./controllers/routine_controller')
const exerciseController = require('./controllers/exercise_controller')
const cookieParser = require('cookie-parser');

server.use(Express.json());
server.use(cors(corsOptions ))
server.use(cookieParser());

server.post('/login',(req,res)=>{
    auth_controller.login(req,res)
})
server.post('/logout',(req,res)=>{
    logoutController.logout(req,res)
})
server.get('/refresh',(req,res)=>{
    refreshTokenController.handleRefreshToken(req,res)
})
// server.post('/updateRoutine',(req,res)=>{
// routineController.updateRoutine(req,res)
// })

server.get('/exercises',(req,res)=>{
    exerciseController.getExercises(req,res)
})

server.get('/routines',auth_controller.requireAuth,(req,res)=>{
    routineController.getAllRoutines(req,res)

})
server.listen(PORT,()=>{
    console.log("Server is up and running!")
})

