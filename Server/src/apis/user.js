const UserModel=require('../models/userModel')

const findUser=async(req,res)=>{
  try{
      let otherUserEmail=req.body.email
      let otherUser=await UserModel.findOne({email:otherUserEmail})
      if(otherUser==null){
        res.status(300).send({message:"No user found"})
      }
      else{
        res.status(200).send({payload:otherUser})
      }
  }
  catch(err){
    res.status(300).send({message:err.message})
  }
}

module.exports=findUser