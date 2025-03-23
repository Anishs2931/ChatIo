const exp=require('express')
const chatApp=exp.Router()
const expressAsyncHandler=require('express-async-handler')
const {newChat,getChats,findChat}=require('../apis/chat')

chatApp.post('/new',expressAsyncHandler(newChat))
chatApp.get('/',expressAsyncHandler(getChats))
chatApp.post('/find',expressAsyncHandler(findChat))

module.exports=chatApp