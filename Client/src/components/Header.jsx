import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'

function Header() {

  const {signOut}=useAuth()
  const {isLoaded,user,isSignedIn}=useUser()
  async function handleSignOut(){
  
      signOut() 
  }

  return (
    <div className='nav justify-content-between p-3 mx-3'>
      <div className='pt-2'>
         <Link to="/">LOGO</Link>
      </div>
      <div>
        {
          !isSignedIn?<>
            <ul className='nav text-unstyled'>
              <li className='nav-item' >
                <Link className='nav-link text-dark' to='signup'>SignUp</Link>
              </li>
              <li className='nav-item'>
                <Link className='nav-link text-dark' to='signin'>SignIn</Link>
              </li>
            </ul>
          </>:
          <>
            <button className='btn btn-danger btn-4' onClick={handleSignOut}>Sign Out</button>
          </>
        }
        
      </div>
    </div>
  )
}

export default Header