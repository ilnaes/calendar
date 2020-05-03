import React, { useContext, useState } from 'react'
import { UserContext } from '../context/usercontext'
import jwtDecode from 'jwt-decode'
import { useHistory, useLocation } from 'react-router-dom'

export default function LoginPage() {
  let history = useHistory()
  let location = useLocation()

  let { updateUser } = useContext(UserContext)
  let [username, setUsername] = useState('')
  let [password, setPassword] = useState('')

  let { from } = location.state || { from: { pathname: '/' } }

  let login = async () => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    }

    let res = await fetch('http://localhost:5000/login', options)
    if (res.ok) {
      let { token } = await res.json()
      let uid = jwtDecode(token).userid
      localStorage.setItem('token', token)
      updateUser({ token, uid, isLoggedIn: true })

      history.replace(from)
    } else {
      console.log(res)
    }
  }

  return (
    <div>
      <h2>Sign In</h2>
      <input
        type="text"
        placeholder="Username"
        onChange={e => {
          setUsername(e.target.value)
        }}
      ></input>
      <br />
      <input
        type="password"
        placeholder="Password"
        onChange={e => {
          setPassword(e.target.value)
        }}
      ></input>
      <br />
      <button onClick={login}>Log in</button>
    </div>
  )
}
