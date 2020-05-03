import React, { useContext } from 'react'
import { UserContext } from '../context/usercontext'
import { AppContext, init } from '../context/appcontext'
import { Redirect, useHistory } from 'react-router-dom'

export default function CalHeader() {
  let history = useHistory()
  let { userState, logoff } = useContext(UserContext)
  let { toggleMenu, incrDelta, decrDelta, zeroDelta, updateApp } = useContext(
    AppContext
  )

  return userState.isLoggedIn ? (
    <div style={{ borderBottom: '1px solid #CCC' }}>
      <div
        className="flex-row"
        style={{ padding: '0.5em', alignItems: 'center' }}
      >
        <div onClick={toggleMenu} className="clickable">
          Toggle
        </div>
        <div className="clickable" onClick={zeroDelta}>
          Today
        </div>
        <div
          className="clickable"
          style={{ padding: '0.5em' }}
          onClick={decrDelta}
        >
          &lt;
        </div>
        <div
          className="clickable"
          style={{ padding: '0.5em' }}
          onClick={incrDelta}
        >
          &gt;
        </div>
        <div style={{ flex: 1 }}>Calendar</div>
        <button
          onClick={() => {
            logoff()
            updateApp(init)
            history.push('/login')
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  ) : (
    <Redirect to={{ pathname: '/login' }} />
  )
}
