import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Styles/Landing.css'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'
import {io} from 'socket.io-client'
import { CurrentUserContextObj } from '../contexts/CurrentUserContext'

const socket=io('http://localhost:4000')

function Landing() {
  const navigate = useNavigate()
  const {currentUser,setCurrentUser}=useContext(CurrentUserContextObj)
  const { isSignedIn, user, isLoaded } = useUser()
  
  useEffect(() => {
    const authorize=async ()=>{
    if (isLoaded && isSignedIn) {
      let res=await axios.post("http://localhost:4000/authorize",currentUser)
      if(res.status===200){
        if(currentUser.userId===''){
          setCurrentUser({...currentUser,userId:res.data.payload.userId})
        }
        console.log(currentUser)
        socket.emit("register",res.data.payload.userId)
        navigate('/chats')
      }
      else{
        alert(res.data.message)
      }
    }
  }
  authorize()
  }, [isLoaded,currentUser,isSignedIn])
  
  if (!isLoaded) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="landing-container background">
      <div className="landing-content">
        <h1>Welcome to ChatApp</h1>
        <p className="lead">Connect with friends and family instantly</p>
        
        <div className="features">
          <div className="feature-card">
            <i className="bi bi-chat-dots"></i>
            <h3>Real-time Chat</h3>
            <p>Instant messaging with real-time updates</p>
          </div>
          <div className="feature-card">
            <i className="bi bi-shield-check"></i>
            <h3>Secure</h3>
            <p>Your conversations are private and secure</p>
          </div>
        </div>

        <div className="buttons">
          <Link to='signin'><button className='btn btn-primary btn-lg me-3 ms-4'>Sign In</button></Link>
          <Link to='signup'><button className='btn btn-outline-primary btn-lg'>Create Account</button></Link>
        </div>
      </div>
    </div>
  )
}

export default Landing