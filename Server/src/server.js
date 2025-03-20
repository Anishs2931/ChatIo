const exp=require("express")
const mongoose=require('mongoose')
const chatModel=require('./models/chatModel')
const {Server}=require('socket.io')
const {createServer}=require('http')
const cors=require('cors')
const socketRoute=require('./socket')
const authRoutes=require('./routes/authRoutes')
const chatRoute=require('./routes/chatRoute')
require('dotenv').config()


const app=exp()
app.use(exp.json())
app.use(cors())

const dburl=process.env.DBURL
const port=process.env.PORT

const httpServer=createServer(app)
const io=new Server(httpServer,{
    cors:{
        origin:"*"
    }
})

mongoose.connect(dburl)
.then(()=>{
    console.log("Database connection success")
    httpServer.listen(port,()=>{console.log("http server listening to port ",port)})
})
.catch((err)=>console.log(err))

socketRoute(io)
app.use('/authorize',authRoutes)
app.use('/chats',chatRoute)

