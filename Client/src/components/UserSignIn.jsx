import { SignIn } from '@clerk/clerk-react'
import React from 'react'
import './Styles/Landing.css'
import { useNavigate } from 'react-router-dom'

function UserSignIn() {

  return (
    <div className='background'>
    <h2 className='text-center text-white pt-5'>Welcome Back!</h2>
    <div className='d-flex justify-content-around align-items-center pt-4'>
          <SignIn />
    </div>
    </div>
  )
}

export default UserSignIn