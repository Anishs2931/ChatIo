const mongoose=require('mongoose')

const messageSchema=new mongoose.Schema({
    messageId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },    
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    text:{
        type:String
    },
    image:{
        type:String
    },
    timestamp:{
        type:mongoose.Schema.Types.Date,
        default:Date.now
    },
    sent:{
        type:Boolean,
        default:false
    },
    delivered:{
        type:Boolean,
        default:false
    },
    read:{
        type:Boolean,
        default:false
    },
    edited:{
        type:Boolean,
        default:false
    },
    activeFor:{
        type:[String]
    },
    deleted:{
        type:Boolean,
        default:false
    }
},{"strict":"throw"})


const chatSchema=new mongoose.Schema({
    chatId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        unique:true
    },
    users:[String],
    messages:{
        type:[messageSchema]
    },
    lastMessageAt:{
        type:mongoose.Schema.Types.Date,
        default: Date.now
    },
    unread:{
        type:Number,
        deafult:0
    }
},{"strict":"throw"})

const chatModel=mongoose.model('chat',chatSchema)

module.exports=chatModel