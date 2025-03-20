
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

  useEffect(() => {
    const newSocket = io("http://localhost:4000")
    setSocket(newSocket)

    return () => {
      if (newSocket) newSocket.disconnect()
    }
  }, [])

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get('http://localhost:4000/chats', {
          headers: {
            'Authorization': `Bearer ${currentUser?.id}`
          }
        })
        if (res.status === 200) {
          setChats(res.data.payload)
        }
      } catch (error) {
        console.error('Failed to fetch chats:', error)
      }
    }

    if (currentUser) {
      fetchChats()
    }
  }, [currentUser])

  useEffect(() => {
    if (!socket) return

    socket.on("receiveMessage", () => {
      const fetchChats = async () => {
        try {
          const res = await axios.get('http://localhost:4000/chats', {
            headers: {
              'Authorization': `Bearer ${currentUser?.id}`
            }
          })
          if (res.status === 200) {
            setChats(res.data.payload)
          }
        } catch (error) {
          console.error('Failed to fetch chats:', error)
        }
      }
      fetchChats()
    })

    return () => {
      socket.off("receiveMessage")
    }
  }, [socket, currentUser])
  
  const users = [
    { id: 1, name: 'Sarah Johnson', avatar: '/api/placeholder/40/40', lastSeen: 'online', unread: 3, 
      lastMessage: 'Hey', time: '10:45 AM' },
    { id: 2, name: 'Mike Chen', avatar: '/api/placeholder/40/40', lastSeen: '5 min ago', unread: 0, 
      lastMessage: 'I sent you the project files', time: '9:30 AM' },
    { id: 3, name: 'Emily Rodriguez', avatar: '/api/placeholder/40/40', lastSeen: '2 hours ago', unread: 1, 
      lastMessage: 'The presentation went well!', time: 'Yesterday' },
    { id: 4, name: 'David Kim', avatar: '/api/placeholder/40/40', lastSeen: 'yesterday', unread: 0, 
      lastMessage: 'Let me know when youre free', time: 'Yesterday' },
    { id: 5, name: 'Jasmine Taylor', avatar: '/api/placeholder/40/40', lastSeen: '3 days ago', unread: 0, 
      lastMessage: 'Thanks for your help!', time: 'Monday' },
    { id: 6, name: 'Work Group', avatar: '/api/placeholder/40/40', lastSeen: '24 participants', unread: 12, 
      lastMessage: 'Alex: Meeting rescheduled to 2pm', time: 'Monday' },
  ];

  const messages = [
    { id: 1, userId: 1, text: 'Hey, how are you?', sent: false, time: '10:30 AM' },
    { id: 2, userId: 1, text: 'I was wondering if we could meet tomorrow to discuss the project?', sent: false, time: '10:32 AM' },
    { id: 3, userId: 0, text: 'Hi Sarah! I\'m doing well, thanks for asking.', sent: true, time: '10:40 AM' },
    { id: 4, userId: 0, text: 'Yes, tomorrow works for me. How about 2pm at the coffee shop?', sent: true, time: '10:42 AM' },
    { id: 5, userId: 1, text: 'Perfect! 2pm at Coffee Corner. See you then!', sent: false, time: '10:45 AM' },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    // In a real app, you would add the message to the messages array here
    setMessage('');
  };

  function handleSignOut(){
      signOut();
  }

  const activeUser = users.find(user => user.id === activeChat);

  return (
    <div className="vh-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container-fluid py-3 h-100">
        <div className="row h-100">
          <div className="col-1 col-md-1 d-none d-md-block px-0">
            <div className="bg-white h-100 rounded-start d-flex flex-column align-items-center py-3">
              <div className="mb-4">
                <img src={`${currentUser?.profileImageUrl}`} className="rounded-circle border-3" style={{ borderColor: '#667eea', borderStyle: 'solid' }} alt="User" width="40" />
              </div>
              <div className="nav flex-column text-center flex-grow-1">
                <div className="nav-item py-3" style={{ color: '#667eea' }}>
                  <i className="fas fa-comment-dots fs-4"></i>
                </div>
                <div className="nav-item py-3">
                  <i className="fas fa-cog fs-4 text-secondary"></i>
                </div>
              </div>
              <div>
                <button className='btn btn-4 text-danger' onClick={handleSignOut}><i className="fas fa-sign-out-alt fs-4 text-secondary"></i></button>
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
                  <input type="text" className="form-control border-start-0" placeholder="Search or start new chat" style={{ background: 'rgba(118, 75, 162, 0.1)' }} />
                </div>
              </div>
              <div>
                {users.map((user) => (
                  <div 
                    key={user.id} 
                    className={`d-flex align-items-center w-100 py-3 border-bottom px-2 ${activeChat === user.id ? 'active' : ''}`}
                    onClick={() => setActiveChat(user.id)}
                    style={{ 
                      cursor: 'pointer',
                      background: activeChat === user.id ? 'rgba(118, 75, 162, 0.2)' : 'transparent' 
                    }}
                  >
                    <div className="position-relative me-3">
                      <img 
                        src={currentUser?.profileImageUrl} 
                        className="rounded-circle" 
                        style={{ 
                          width: '40px',
                          height: '40px'
                        }} 
                        alt=''
                      />
                      {user.lastSeen === 'online'? (
                        <span 
                          className="position-absolute bottom-0 end-0 rounded-circle"
                          style={{
                            width: '12px',
                            height: '12px',
                            background: '#4caf50',
                            border: '1px solid white'
                          }}
                        ></span>):<></>
                      }
                    </div>
                    <div className='w-100'>
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">{user.name}</h6>
                        <small className="text-muted">{user.time}</small>
                      </div>
                      <div className='d-flex justify-content-between align-items-center'>
                      <p className="mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                        {user.lastMessage}
                      </p>
                      <div>
                        {user.unread > 0 && (
                        <div 
                          className="ms-2 d-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            minWidth: '20px',
                            height: '20px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {user.unread}
                        </div>
                        )}
                      </div>
                      </div>
                    </div>
                    
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="col-8 col-md-8 px-0">
            <div className="bg-white h-100 rounded-end d-flex flex-column">
              {activeUser ? (
                <>
                  <div className="p-3 border-bottom d-flex align-items-center" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                    <img src={activeUser.avatar} className="rounded-circle me-3" style={{ width: '45px', height: '45px', border: '2px solid #667eea' }} alt={activeUser.name} />
                    <div className="flex-grow-1">
                      <h6 className="mb-0">{activeUser.name}</h6>
                      <small className="text-muted">{activeUser.lastSeen}</small>
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
                  <div 
                    className="flex-grow-1 overflow-auto p-3" 
                    style={{ 
                      background: 'rgba(236, 236, 236, 0.5)'
                    }}
                  >
                    <div className="d-flex flex-column">
                      {messages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`mb-3 d-flex ${msg.sent ? 'justify-content-end' : 'justify-content-start'}`}
                        >
                          <div 
                            style={{
                              maxWidth: '75%',
                              padding: '10px 15px',
                              borderRadius: msg.sent ? '15px 15px 0px 15px' : '15px 15px 15px 0px',
                              background: msg.sent ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                              color: msg.sent ? 'white' : 'black',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }}
                          >
                            <p className="mb-0">{msg.text}</p>
                            <small className={`d-block text-end ${msg.sent ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
                              {msg.time} {msg.sent && <i className="fas fa-check-double ms-1"></i>}
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
    </div>
  );
};

export default Chats;