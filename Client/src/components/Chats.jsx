import React, { useContext, useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import {useAuth} from '@clerk/clerk-react'
import { CurrentUserContextObj } from '../contexts/CurrentUserContext'
import Chat from './UserChat'
import axios from 'axios'

const Chats = () => {
  const {signOut}=useAuth()
  const { currentUser } = useContext(CurrentUserContextObj)
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [socket, setSocket] = useState(null)
  const [message,setMessage]=useState('')
  const [showAddChat, setShowAddChat] = useState(false)
  const [searchEmail, setSearchEmail] = useState('')
  const [searchResult,setSearchResult]=useState({})
  const [showResult,setShowResult]=useState(false)
  const [searchError,setSearchError]=useState('')
  const [errorStatus,setErrorStatus]=useState(false)
  const [isNewChat,setIsNewChat]=useState(false)
  const [activeUser, setActiveUser] = useState(null)
  const [messages, setMessages] = useState([])

  useEffect(()=>{
    if(activeChat){
      setActiveUser(getOtherUserFromChat(activeChat.chatId))
    }
  },[activeChat])

  useEffect(() => {
    const newSocket = io("http://localhost:4000")
    setSocket(newSocket)
    return () => {
      if (newSocket) newSocket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (currentUser) {
      getChats()
    }
  }, [currentUser])

  useEffect(() => {
    if (!socket) return
    socket.on("receiveMessage", () => {
      getChats()
    })
    return () => {
      socket.off("receiveMessage")
    }
  }, [socket])


  const getOtherUserFromChat = (chat) => {
    if (!chat?.users) return null;
    return chat.users.find(user => user.userId !== currentUser.userId);
  }

  async function getChats(){
    try {
      let res = await axios.get('http://localhost:4000/chats', {
        params: { userId: currentUser.userId }
      })
      if(res?.status === 200) {
        setChats(res?.data?.payload)
      }
    } catch(err) {
      console.error('Failed to fetch chats:', err)
    }
  }

  function handleSignOut(){
    signOut()
  }

  async function newChat(){
    try{
      let reqObj = {
        userOne: currentUser,
        userTwo: searchResult
      }
      console.log(reqObj)
      let req = await axios.post('http://localhost:4000/chats/new', reqObj)
      if(req.status === 200){
        getChats()     
        setActiveChat(req.data.payload.chatId)
        setShowAddChat(false)
        setSearchEmail('')
        setSearchResult({})
        setShowResult(false)
      }
    } catch(err) {
      console.log('Failed to create chat:', err)
    }
  }

  async function searchNewUser() {
    try {
      const res = await axios.post('http://localhost:4000/users/find', {email: searchEmail})
      
      if(res.status === 200) {
        setSearchResult(res.data.payload)
        
        if(res.data.payload?.userId && res.data.payload.userId !== currentUser.userId) {
          let chatRes = await axios.post('http://localhost:4000/chats/find', {
            userId: currentUser.userId,
            otherUserId: res.data.payload.userId
          })
          
          setIsNewChat(!chatRes.data.exists)
        } else {
          setIsNewChat(false)
        }
  
        setErrorStatus(false)
        setSearchError('')
        setShowResult(true)
      }
    } catch(err) {
      setSearchResult({})
      setShowResult(false)
      setIsNewChat(false)
      setErrorStatus(true)
      setSearchError(err.response?.data?.message || 'User not found')
    }
  }

  function addChat(){
    return (
      <div className="modal" style={{
        display: showAddChat ? 'block' : 'none',
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1000
      }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-4" style={{ borderRadius: '15px' }}>
            <h5 className="mb-3">Add New Chat</h5>
            <div className="input-group mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Enter user email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
              <button 
                className="btn"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}
                onClick={searchNewUser}
              >
                Search
              </button>
            </div>
            <div>
              {showResult && 
                <div className='d-flex align-items-center w-100 py-3 border-bottom px-2'>         
                  <div className="me-3">
                    <img 
                      src={searchResult?.profileImageUrl} 
                      className="rounded-circle" 
                      style={{ width: '40px', height: '40px' }}
                      alt=''
                    />
                  </div>
                  <div className='w-100'>
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">{searchResult?.firstName}</h6>
                    </div>
                  </div>
                  <div className='mx-auto'>
                    {isNewChat && 
                      <div>
                        <button className="btn btn-4 btn-success" onClick={newChat}>
                          Add
                        </button>
                      </div>
                    }
                  </div>
                </div>
              }
              {errorStatus && 
                <div><p className='text-warning ms-2'>{searchError}</p></div>
              }
            </div>
            <button 
              className="btn btn-link text-muted"
              onClick={() => {
                setShowAddChat(false)
                setShowResult(false)
                setSearchResult({})
                setSearchEmail('')
                setErrorStatus(false)
                setSearchError('')
                setIsNewChat(false)
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    
    // Add message sending logic here
    
    setMessage('')
  }

  return (
    <div className="vh-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container-fluid py-3 h-100">
        <div className="row h-100">
          <div className="col-1 col-md-1 d-none d-md-block px-0">
            <div className="bg-white h-100 rounded-start d-flex flex-column align-items-center py-3">
              <div className="mb-4">
                <img src={currentUser?.profileImageUrl} className="rounded-circle border-3" 
                  style={{ borderColor: '#667eea', borderStyle: 'solid' }} alt="User" width="40" />
              </div>
              <div className="nav flex-column text-center flex-grow-1">
                <div className="nav-item py-3" style={{ color: '#667eea' }}>
                  <i className="fas fa-comment-dots fs-4"></i>
                </div>
                <div className='nav-item py-3'>
                  <button className='btn py-0 pt-1' 
                    style={{ color: '#667eea' }} 
                    onClick={() => setShowAddChat(true)}
                  >
                    <i className='fas fa-plus fs-4'></i>
                  </button>
                </div>
                <div className="nav-item py-3">
                  <i className="fas fa-cog fs-4 text-secondary"></i>
                </div>
              </div>
              <div>
                <button className='btn btn-4 text-danger' onClick={handleSignOut}>
                  <i className="fas fa-sign-out-alt fs-4 text-secondary"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="col-4 col-md-3 px-0">
            <div className="bg-white h-100 d-flex flex-column">
              <div className="p-3 border-bottom" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-end-0">
                    <i className="fas fa-search text-secondary"></i>
                  </span>
                  <input type="text" className="form-control border-start-0" 
                    placeholder="Search or start new chat" 
                    style={{ background: 'rgba(118, 75, 162, 0.1)' }} 
                  />
                </div>
              </div>
              <div>
                {chats.map((chat) => {
                  const otherUserId = getOtherUserFromChat(chat)
                  return (
                    <div 
                      key={chat.chatId} 
                      className={`d-flex align-items-center w-100 py-3 border-bottom px-2 ${activeChat === chat.chatId ? 'active' : ''}`}
                      onClick={() => setActiveChat(chat.chatId)}
                      style={{ 
                        cursor: 'pointer',
                        background: activeChat === chat.chatId ? 'rgba(118, 75, 162, 0.2)' : 'transparent' 
                      }}
                    >
                      <div className="position-relative me-3">
                        <img 
                          src={otherUserId?.profileImageUrl || 'default-avatar.png'} 
                          className="rounded-circle" 
                          style={{ width: '40px', height: '40px' }}
                          alt=''
                        />
                      </div>
                      <div className='w-100'>
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">{otherUserId?.firstName || 'Unknown User'}</h6>
                          <small className="text-muted">
                            {chat.lastMessageAt ? new Date(chat.lastMessageAt).toLocaleTimeString() : ''}
                          </small>
                        </div>
                        <div className='d-flex justify-content-between align-items-center'>
                          <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                            {chat.messages[chat.messages.length - 1]?.text || 'No messages yet'}
                          </p>
                          {chat.unread > 0 && (
                            <div className="ms-2 d-flex align-items-center justify-content-center rounded-circle"
                              style={{
                                minWidth: '20px',
                                height: '20px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: 'bold'
                              }}
                            >
                              {chat.unread}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="col-8 col-md-8 px-0">
            <div className="bg-white h-100 rounded-end d-flex flex-column">
              {activeChat ? (
                <>
                  <div className="p-3 border-bottom d-flex align-items-center" 
                    style={{ background: 'rgba(255, 255, 255, 0.95)' }}
                  >
                    <img 
                      src={activeUser?.profileImageUrl || 'default-avatar.png'} 
                      className="rounded-circle me-3" 
                      style={{ width: '45px', height: '45px', border: '2px solid #667eea' }} 
                      alt={activeUser?.firstName} 
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-0">{activeUser?.firstName}</h6>
                      <small className="text-muted">
                        {activeUser?.isOnline ? 'Online' : 'Offline'}
                      </small>
                    </div>
                    <div>
                      <button className="btn border-0 me-2" style={{ color: '#667eea' }}>
                        <i className="fas fa-search"></i>
                      </button>
                      <button className="btn border-0 me-2" style={{ color: '#667eea' }}>
                        <i className="fas fa-phone"></i>
                      </button>
                      <button className="btn border-0" style={{ color: '#667eea' }}>
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                    </div>
                  </div>

                  <div className="flex-grow-1 overflow-auto p-3" 
                    style={{ background: 'rgba(236, 236, 236, 0.5)' }}
                  >
                    <div className="d-flex flex-column">
                      {messages.map((msg) => (
                        <div 
                          key={msg.messageId} 
                          className={`mb-3 d-flex ${msg.senderId === currentUser.userId ? 'justify-content-end' : 'justify-content-start'}`}
                        >
                          <div 
                            style={{
                              maxWidth: '75%',
                              padding: '10px 15px',
                              borderRadius: msg.senderId === currentUser.userId ? '15px 15px 0px 15px' : '15px 15px 15px 0px',
                              background: msg.senderId === currentUser.userId ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                              color: msg.senderId === currentUser.userId ? 'white' : 'black',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}
                          >
                            <p className="mb-0">{msg.text}</p>
                            <small className={`d-block text-end ${msg.senderId === currentUser.userId ? 'text-white-50' : 'text-muted'}`} 
                              style={{ fontSize: '0.7rem' }}
                            >
                              {new Date(msg.timestamp).toLocaleTimeString()} 
                              {msg.senderId === currentUser.userId && (
                                <i className={`fas fa-${msg.read ? 'check-double' : 'check'} ms-1`}></i>
                              )}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 border-top" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                    <form onSubmit={handleSendMessage} className="d-flex align-items-center">
                      <button type="button" className="btn text-secondary me-2">
                        <i className="far fa-smile fs-5"></i>
                      </button>
                      <button type="button" className="btn text-secondary me-2">
                        <i className="fas fa-paperclip fs-5"></i>
                      </button>
                      <input 
                        type="text" 
                        className="form-control rounded-pill me-2" 
                        placeholder="Type a message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{ background: 'rgba(118, 75, 162, 0.1)' }}
                      />
                      <button 
                        type="submit" 
                        className="btn rounded-circle d-flex align-items-center justify-content-center"
                        disabled={!message.trim()}
                        style={{
                          width: '45px',
                          height: '45px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white'
                        }}
                      >
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center p-4">
                  <div 
                    className="rounded-circle mb-4 d-flex align-items-center justify-content-center"
                    style={{
                      width: '150px',
                      height: '150px',
                      background: 'rgba(118, 75, 162, 0.1)'
                    }}
                  >
                    <i className="fas fa-comments fa-4x" style={{ color: '#764ba2' }}></i>
                  </div>
                  <h4 style={{ color: '#764ba2' }}>Welcome to Chats</h4>
                  <p className="text-muted">Select a conversation or start a new chat</p>
                  <button 
                    className="btn rounded-pill px-4 mt-3"
                    onClick={() => setShowAddChat(true)}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white'
                    }}
                  >
                    <i className="fas fa-plus me-2"></i> New Conversation
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showAddChat && addChat()}
    </div>
  )
}

export default Chats