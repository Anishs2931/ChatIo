import {useState,useEffect, useContext} from 'react'
import {io} from 'socket.io-client'
import {useUser} from '@clerk/clerk-react'
import {CurrentUserContextObj} from '../contexts/CurrentUserContext'
import axios from 'axios'

const socket =io("http://localhost:4000")

function Trial() {

    async function handleLogin(){
      let userObj={
        firstName:user.firstName,
        lastName:user.lastName,
        email:user.emailAddresses[0].emailAddress,
        profileImageUrl:user.imageUrl,
        chats:[]
      }
      let res=await axios.post("http://localhost:4000/authorize",userObj)
      setCurrentUser(res.data.payload)     
      socket.emit("register",res.data.payload.userId)
    }
    
 
    let [firstSignIn,setFirstSignIn]=useState(true)
    let {isLoaded,user,isSignedIn}=useUser()
    let [message,setMessage]=useState("")
    let [messages,setMessages]=useState([])
    let {currentUser,setCurrentUser}=useContext(CurrentUserContextObj)

    if(isSignedIn&&firstSignIn){
      handleLogin()
      setFirstSignIn(false)
    }

    useEffect(()=>{
      socket.on("receiveMessage",(res)=>{
        

      })
      return ()=>{
        socket.off("receiveMessage")
      }
    },[])

    async function sendMessage(){
      // let chatId='67cbb96aa34dd946e9435109'
      // if(message.trim()!==""){
      //   let msgObj={
      //     senderId:currentUser.userId,
      //     receiverId:'67cb4f67c4ffbc3c4b7018d1',
      //     text:message          
      //   }
      //   socket.emit("sendMessage",{chatId,msgObj})
      //   setMessage("")
      // }
      let res=await axios.post("http://localhost:4000/chats")
      if(res.status==200){
        console.log(res)
      }

    }
  return (
    <div className="container m-5 p-5">
      {
        messages.map((msg,index)=>
        <div key={index} className="d-flex m-3"><h4 className="m-0 me-4">{msg}</h4><p className="m-0 pt-1">{msg.message}</p></div>
      )}
      <input
        type="text"
        value={message}
        onChange={(e)=>setMessage(e.target.value)}
        className="mt-5"
      ></input>
      <button className="btn btn-4 ms-3" onClick={sendMessage}>Send</button>
    </div>
  )
}

export default Trial