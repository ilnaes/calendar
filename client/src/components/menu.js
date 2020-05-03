import React, { useContext } from 'react'
import { AppContext } from '../context/appcontext'
import MonthCard from './month'
import { toSun } from '../util'

export default function Menu() {
  let { appState, updateApp, incrDelta, decrDelta, toggleVisible } = useContext(
    AppContext
  )
  let today = new Date()

  function toggle(e) {
    toggleVisible(e.target.name)
  }

  let callback = x => {
    x.setMinutes(1)
    let sun = toSun(today)
    sun.setHours(0)
    sun.setMinutes(0)
    sun.setSeconds(0)
    let del = Math.floor(
      (x.getTime() - sun.getTime()) / (1e3 * 60 * 60 * 24 * 7)
    )

    updateApp(prev => {
      let res = prev.delta
      res['week'] = del
      return { delta: res }
    })
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
          month={today.getMonth() + appState.delta.month}
          year={today.getYear()}
          callback={callback}
          incr={() => incrDelta('month')}
          decr={() => decrDelta('month')}
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
