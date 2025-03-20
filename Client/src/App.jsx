import { useState,useEffect } from "react"
import {Outlet,Link} from "react-router-dom"
import './App.css'

function App() {

  return (
      <div style={{minHeight:'100vh'}}>
        <Outlet />
      </div>
  )
}

export default App;