import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.css'
import "@fortawesome/fontawesome-free/css/all.css";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import UserSignIn from './components/UserSignIn.jsx'
import UserSignUp from './components/UserSignUp.jsx'
import Landing from './components/Landing.jsx'
import Chats from './components/Chats.jsx'
import CurrentUserContext from './contexts/CurrentUserContext.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const browserRouterObj = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Landing />
      },
      {
        path: "signin/*",
        element: <UserSignIn />
      },
      {
        path: "signup/*",
        element: <UserSignUp />
      },
      {
        path: "chats",
        element: <Chats />
      }
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <CurrentUserContext>
       <RouterProvider router={browserRouterObj} />
      </CurrentUserContext>
    </ClerkProvider>
  </StrictMode>
)