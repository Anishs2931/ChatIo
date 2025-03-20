const exp=require('express')
const chatApp=exp.Router()
const expressAsyncHandler=require('express-async-handler')
const {newChat,getChats}=require('../apis/chat')

chatApp.post('/',expressAsyncHandler(newChat))
chatApp.get('/',expressAsyncHandler(getChats))

module.exports=chatApp