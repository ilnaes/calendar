import React, { useState } from 'react'
import jwtDecode from 'jwt-decode'

let token = localStorage.getItem('token')
let uid = token && jwtDecode(token).userid

let init = {
  token: token,
  uid: uid,
  isLoggedIn: uid != null
}

export const UserContext = React.createContext({})

export const UserProvider = props => {
  let [userState, updateUser] = useState(init)
  const logoff = () => {
    updateUser({ isLoggedIn: false })
    localStorage.clear()
  }

  return (
    <UserContext.Provider value={{ userState, updateUser, logoff }}>
      {props.children}
    </UserContext.Provider>
  )
}
