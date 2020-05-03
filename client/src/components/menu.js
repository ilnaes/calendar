import React, { useContext } from 'react'
import { AppContext } from '../context/appcontext'
import MonthCard from './month'

export default function Menu() {
  let { appState, updateApp, toggleVisible } = useContext(AppContext)
  let today = new Date()

  function toggle(e) {
    toggleVisible(e.target.name)
  }

  let callback = x => {
    window.alert(x)
  }

  if (appState.isMenuVisible) {
    return (
      <div style={{ width: '14em', padding: '1em' }} className="flex-col">
        <div
          className="clickable"
          style={{
            border: '1px solid #CCC',
            padding: '1em 2em 1em 2em',
            borderRadius: '2em',
            textAlign: 'center',
            width: '4em',
            fontSize: '0.8em',
            marginBottom: '1em'
          }}
          onClick={() => {
            updateApp({ isCreating: true })
          }}
        >
          + Create
        </div>
        <MonthCard
          month={today.getMonth() + 1 + appState.delta.month}
          year={1900 + today.getYear()}
          callback={callback}
        />
        <div className="flex-col" style={{ padding: '1em' }}>
          {appState.calendars.map(x => (
            <div key={x.id}>
              <input
                key={x.id}
                id={x.id}
                name={x.id}
                type="checkbox"
                checked={appState.visibleCals.includes(x.id)}
                onChange={toggle}
              />
              <label htmlFor={x.id}></label> {x.name}
            </div>
          ))}
        </div>
      </div>
    )
  } else {
    return null
  }
}
