import dotenv from 'dotenv';

dotenv.config();// must be first, before other requires
const Express = require("express")
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const server = Express()
const PORT = 3001
const auth_controller = require("./controllers/auth_controller")

const routineController = require('./controllers/routine_controller')
const exerciseController = require('./controllers/exercise_controller')
const cookieParser = require('cookie-parser');

server.use(Express.json());
server.use(cors(corsOptions ))
server.use(cookieParser());

server.post('/login',(req:Request,res:Response)=>{
    auth_controller.login(req,res)
})
// server.post('/logout',(req,res)=>{
//     logoutController.logout(req,res)
// })
// server.get('/refresh',(req,res)=>{
//     refreshTokenController.handleRefreshToken(req,res)
// })
// server.post('/updateRoutine',(req,res)=>{
// routineController.updateRoutine(req,res)
// })

server.get('/exercises',(req:Request,res:Response)=>{
    exerciseController.getExercises(req,res)
})

server.get('/routines',auth_controller.requireAuth,(req:Request,res:Response)=>{
    routineController.getAllRoutines(req,res)

})

server.post('/routines/add',auth_controller.requireAuth,(req:Request,res:Response)=>{
    routineController.addRoutine(req,res)
})

server.post('/routines/update',auth_controller.requireAuth,(req:Request,res:Response)=>{
    routineController.updateRoutine(req,res)
})
server.post('/routines/delete',auth_controller.requireAuth,(req:Request,res:Response)=>{
    routineController.deleteRoutine(req,res)
})


server.listen(PORT,()=>{
    console.log("Server is up and running!")
})

