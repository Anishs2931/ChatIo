const { default: mongoose } = require('mongoose')
const chatModel=require('../models/chatModel')

const newChat=async(req,res)=>{
    try{
      let chatObj={
        chatId:new mongoose.Types.ObjectId,
        messages:[]
      }
      let chatDoc=new chatModel(chatObj)
      let dbres=await chatDoc.save()
      res.status(200).send({message:"chat created",payload:dbres})
    }
    catch(err){
        res.status(300).send({message:err.message})
    }
}

const getChats=async(req,res)=>{
  let chats=req.body
  try{
    let dbres=await chatModel.find({chatId:{$in:chats}}).sort({lastMessageAt:-1}).exec()
    res.status(200).send({message:chats,payload:dbres})
  }
  catch(err){
    res.status(500).send({message:err.message})
  }
}

module.exports={newChat,getChats}