import React from 'react'
import './Styles/Landing.css'
import { SignUp } from '@clerk/clerk-react'

function UserSignUp() {
  return (
    <div className='d-flex justify-content-around align-items-center pt-5 background'>
        <SignUp />
    </div>
  )
}

export default UserSignUp