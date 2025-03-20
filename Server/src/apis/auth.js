const userModel=require('../models/userModel')
const mongoose=require('mongoose')


const userLogin= async (req,res)=>{
    try{
        let userObj=req.body
        let userInDb=await userModel.findOne({email:userObj.email})

        if(userInDb===null){
            let userDoc=userModel({...userObj,userId:new mongoose.Types.ObjectId()})
            let dbres=await userDoc.save()
            res.status(200).send({message:"User Registered",payload:dbres})
        }
        else{
            res.status(200).send({message:"login successful",payload:userInDb})
        }
    }
      catch(err){
        res.status(500).send({message:err.message})
      }
}

module.exports=userLogin



