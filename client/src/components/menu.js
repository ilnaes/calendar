import React, { useContext } from 'react'
import { AppContext } from '../context/appcontext'

export default function Menu() {
  let { appState, updateApp, toggleVisible } = useContext(AppContext)

  function toggle(e) {
    toggleVisible(e.target.name)
  }

  if (appState.isMenuVisible) {
    return (
      <div style={{ width: '14em', padding: '2em' }} className="flex-col">
        <div
          className="clickable"
          style={{
            border: '1px solid #CCC',
            padding: '1em 2em 1em 2em',
            borderRadius: '2em',
            textAlign: 'center',
            width: '4em',
            fontSize: '0.8em'
          }}
          onClick={() => {
            updateApp({ isCreating: true })
          }}
        >
          + Create
        </div>
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
