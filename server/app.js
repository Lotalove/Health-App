const Express = require("express")
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const server = Express()
const PORT = 3001
const login_controller = require("./controllers/login_controller")
const logoutController = require('./controllers/logout_controller')
const refreshTokenController = require('./controllers/refreshTokenController');
const routineController = require('./controllers/routine_controller')
const cookieParser = require('cookie-parser');

server.use(Express.json());
server.use(cors(corsOptions ))
server.use(cookieParser());

server.post('/login',(req,res)=>{
    login_controller.login(req,res)
})
server.post('/logout',(req,res)=>{
    logoutController.logout(req,res)
})
server.get('/refresh',(req,res)=>{
    refreshTokenController.handleRefreshToken(req,res)
})
server.post('/updateRoutine',(req,res)=>{
routineController.updateRoutine(req,res)
})
server.listen(PORT,()=>{
    console.log("Server is up and running!")
})

