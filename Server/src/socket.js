const { default: mongoose } = require("mongoose")
const chatModel = require("./models/chatModel")

users={}

module.exports=(io)=>{
    io.on("connection",(socket)=>{
        socket.on("register",(userId)=>{
            users[userId]=socket.id
            console.log(`${userId} connected with socketId`,socket.id)
        })
    
        socket.on("sendMessage",async ({chatId,msgObj})=>{
            msgObj={
                messageId:new mongoose.Types.ObjectId,
                ...msgObj,
                sent:true
            }
            await chatModel.findByIdAndUpdate(
                chatId,
                {$push:{messages:msgObj},$set:{lastMessageAt:Date.now()}}
            )
    
            socket.emit("sent")

            const receiverId=Object.keys(users).find(key=>users[key]===msgObj.receiverId)
            if(receiverId){
                msgObj={...msg,delivered:true}
                await chatModel.findByIdAndUpdate(
                    {chatId:chatId,"messages.messageId":msgObj.messageId},
                    {$set:{"messages.$.delivered":true}
                }
                )
                io.to(users[msgObj.receiverId]).emit("receiveMessage")
                socket.emit("delivered")
            }
        })
        socket.on("edit",async({chatId,msgObj})=>{
            await chatModel.findByIdAndUpdate(
                {chatId:chatId,"messages.messageId":msgObj.messageId},
                {$set:{"messages.$.text":msgObj.text,"messages.$.delivered":false,
                       "messages.$.seen":false,"messages.$.edited":true
                }}
            )
            socket.emit("edited")
            
            const receiverId=Object.keys(users).find(key=>users[key]===msgObj.receiverId)
            if(receiverId){
                msgObj={...msg,delivered:true}
                await chatModel.findByIdAndUpdate(
                    {chatId:chatId,"messages.messageId":msgObj.messageId},
                    {$set:{"messages.$.delivered":true}
                }
                )
                io.to(users[msgObj.receiverId]).emit("receiveMessage")
                socket.emit("delivered")
            }
        })

        socket.on("delete",async({chatId,messageId,userId})=>{
            await chatModel.findByIdAndUpdate(
                {chatId:chatId,"messages.messageId":messageId},
                {$pull:{"messages.$.activeFor":userId}}
            )
            socket.send("deleted")
        })

        socket.on("deleteForAll",async({chatId,messageId,userId})=>{
            await chatModel.findByIdAndUpdate(
                {chatId:chatId,"messages.messageId":messageId},
                {$set:{"messages.$.deleted":true}}
            )
            socket.send("deletedForAll")
            const receiverId=Object.keys(users).find(key=>users[key]===msgObj.receiverId)
            if(receiverId){
                io.to(users[msgObj.receiverId]).emit("receiveMessage")
            }
            socket.send("deltedForAll")
        })

        socket.on("disconnect",async () => {
            const Id = Object.keys(users).find(key => users[key] === socket.id);
            if (Id) {
                delete users[Id];
                console.log(`${Id} disconnected`);
                io.emit("disconnected")
            }
        });
    })
}