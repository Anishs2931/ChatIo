const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    messageId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },    
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    text: {
        type: String
    },
    image: {
        type: String
    },
    timestamp: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    },
    sent: {
        type: Boolean,
        default: false
    },
    delivered: {
        type: Boolean,
        default: false
    },
    read: {
        type: Boolean,
        default: false
    },
    edited: {
        type: Boolean,
        default: false
    },
    activeFor: {
        type: [String]
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {"strict": "throw"})

const userInfoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String
    }
}, { _id: false })

const chatSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    users: {
        type: [userInfoSchema],
        validate: {
            validator: function(users) {
                return users.length === 2;
            },
            message: 'Chat must have exactly 2 users'
        }
    },
    messages: {
        type: [messageSchema]
    },
    lastMessage: {
        type: String
    },
    lastMessageAt: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    },
    unread: {
        type: Number,
        default: 0
    }
}, {"strict": "throw"})

const chatModel = mongoose.model('chat', chatSchema)

module.exports = chatModel