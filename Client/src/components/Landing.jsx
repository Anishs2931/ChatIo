import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Styles/Landing.css'
import { useUser } from '@clerk/clerk-react'

function Landing() {
  const navigate = useNavigate()
  
  const { isSignedIn, user, isLoaded } = useUser()
  
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/chats')
    }
  }, [isLoaded, isSignedIn, navigate])
  
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