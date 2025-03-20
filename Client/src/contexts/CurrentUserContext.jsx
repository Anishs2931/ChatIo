import React, { createContext, useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'

export const CurrentUserContextObj = createContext()

function CurrentUserContext({ children }) {
  const { user, isLoaded } = useUser()
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    if (isLoaded && user) {
      const userData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0].emailAddress,
        profileImageUrl: user.imageUrl,
        isOnline: true,
        chats: []
      }
      setCurrentUser(userData)
    }
  }, [isLoaded, user])

  const value = {
    currentUser,
    setCurrentUser
  }

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
    <CurrentUserContextObj.Provider value={value}>
      {children}
    </CurrentUserContextObj.Provider>
  )
}

export default CurrentUserContext