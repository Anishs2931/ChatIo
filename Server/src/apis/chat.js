const { default: mongoose } = require('mongoose')
const chatModel=require('../models/chatModel')
const UserModel=require('../models/userModel');
const userModel = require('../models/userModel');


const newChat = async(req, res) => {
  try {
      const userOne = req.body.userOne;
      const userTwo = req.body.userTwo;

      if (!userOne?.userId || !userTwo?.userId) {
          res.status(300).send({
            success: false,
              message: "Both users are required"
          });
      }

      const userOneInfo = {
          userId: userOne.userId,
          firstName: userOne.firstName,
          lastName: userOne.lastName || "",
          email: userOne.email,
          profileImageUrl: userOne.profileImageUrl || "",
      };

      const userTwoInfo = {
          userId: userTwo.userId,
          firstName: userTwo.firstName,
          lastName: userTwo.lastName || "",
          email: userTwo.email,
          profileImageUrl: userTwo.profileImageUrl || "",
      };

      const chatObj = {
          chatId: new mongoose.Types.ObjectId(),
          users: [userOneInfo, userTwoInfo],
          messages: [],
          lastMessage: "",
          lastMessageAt: new Date(),
          unread: 0
      };

      const chatDoc = new chatModel(chatObj);
      const dbres = await chatDoc.save();

      if(dbres!==null){
        await userModel.findOneAndUpdate({userId:userOne.userId},{$push:{chats:dbres.chatId}})
      }
      res.status(200).send({message: "Chat created successfully",payload: dbres
      });

  } catch(err) {
      console.error('Create chat error:', err);
      res.status(500).send({success: false,message: err.message
      });
  }
};


const getChats=async(req,res)=>{
  try{
    let userId=req.query.userId 
    let dbres=await chatModel.find({chatId:{$in:chats}}).sort({lastMessageAt:-1}).exec()
    res.status(200).send({message:chats,payload:dbres})
  }
  catch(err){
    res.status(300).send({message:err.message})
  }
}

const findChat = async(req, res) => {
  try {
    const { userId, otherUserId } = req.body;

    if (!userId || !otherUserId) {
      res.status(300).send({message: "Both user IDs are required"});
    }
    const chat = await chatModel.findOne({
      "users": {
        $all: [
          { $elemMatch: { userId: userId } },
          { $elemMatch: { userId: otherUserId } }
        ]
      }
    });

    res.status(200).send({
      success: true,
      exists: chat !== null,
      message: chat ? "Chat already exists" : "No chat found",
      payload: chat
    });

  } catch(err) {
    console.error('Find chat error:', err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports={newChat,getChats,findChat}