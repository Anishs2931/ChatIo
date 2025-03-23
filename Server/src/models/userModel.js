const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        unique:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    profileImageUrl:{
        type:String,
    },
    isOnline:{
        type:Boolean,
        default:false
    },
    chats:{
        type:[mongoose.Schema.Types.ObjectId]   
    }
},{"strict":"throw"})

const userModel=mongoose.model('user',userSchema);

module.exports=userModel