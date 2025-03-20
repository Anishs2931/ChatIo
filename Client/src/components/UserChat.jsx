import React, { useState, useEffect, useRef } from 'react'
import './Styles/Chat.css'

function Chat({ activeChat, currentUser, socket }) {
  const [message, setMessage] = useState("")
  const [editingMessage, setEditingMessage] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [activeChat?.messages])

  const handleSendMessage = async () => {
    if (!message.trim()) return
    
    try {
      await socket.emit("sendMessage", {
        chatId: activeChat._id,
        msgObj: {
          senderId: currentUser.id,
          receiverId: activeChat.users.find(id => id !== currentUser.id),
          text: message
        }
      })
      setMessage("")
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleEditMessage = async (messageId, newText) => {
    try {
      await socket.emit("edit", {
        chatId: activeChat._id,
        msgObj: {
          messageId: messageId,
          text: newText
        }
      })
      setEditingMessage(null)
    } catch (error) {
      console.error('Failed to edit message:', error)
    }
  }

  const handleDeleteMessage = async (messageId) => {
    try {
      await socket.emit("delete", {
        chatId: activeChat._id,
        messageId: messageId,
        userId: currentUser.id
      })
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }

  if (!activeChat) {
    return (
      <div className="chat-main">
        <div className="no-chat-selected">
          <i className="bi bi-chat-dots"></i>
          <h4>Select a chat to start messaging</h4>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-main">
      <div className="chat-header">
        <img 
          src={activeChat.profileImageUrl || 'default-chat.png'} 
          alt="chat" 
        />
        <div className="chat-header-info">
          <h6>{activeChat.name}</h6>
          <small>online</small>
        </div>
      </div>

      <div className="messages">
        {activeChat.messages.map(msg => (
          <div 
            key={msg.messageId}
            className={`message ${msg.senderId === currentUser.id ? 'sent' : 'received'}`}
          >
            {editingMessage === msg.messageId ? (
              <div className="edit-message">
                <input
                  type="text"
                  defaultValue={msg.text}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleEditMessage(msg.messageId, e.target.value)
                    }
                  }}
                  autoFocus
                />
                <button onClick={() => setEditingMessage(null)}>
                  <i className="bi bi-x"></i>
                </button>
              </div>
            ) : (
              <>
                <p>{msg.text}</p>
                <div className="message-actions">
                  <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                  {msg.senderId === currentUser.id && (
                    <div className="message-buttons">
                      <button onClick={() => setEditingMessage(msg.messageId)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button onClick={() => handleDeleteMessage(msg.messageId)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>
          <i className="bi bi-send"></i>
        </button>
      </div>
    </div>
  )
}

export default Chat