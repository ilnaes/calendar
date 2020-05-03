import React, { useContext, useState, useRef, useEffect } from 'react'
import { AppContext } from '../context/appcontext'
import { useMutation } from 'react-apollo'
import { gql } from 'apollo-boost'

export const ADD_EVENT = gql`
  mutation AddEvent($event: EventInput!) {
    createEvent(event: $event)
  }
`

export const ADD_CALENDAR = gql`
  mutation AddCalendar($name: String!) {
    createCalendar(name: $name)
  }
`

export function CreateEvent() {
  let { appState, updateApp } = useContext(AppContext)

  let [event, setEvent] = useState(true)
  let [title, setTitle] = useState('')
  let [start, setStart] = useState('')
  let [end, setEnd] = useState('')
  let [cal, setCal] = useState(appState.calendars[0].id)

  let [createEvent] = useMutation(ADD_EVENT)
  let [createCalendar] = useMutation(ADD_CALENDAR)

  const ref = useRef(null)

  let handleClick = e => {
    if (ref.current && !ref.current.contains(e.target)) {
      updateApp({ isCreating: null })
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClick)

    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  })

  let submit = async () => {
    updateApp({ isCreating: null })

    if (event) {
      createEvent({
        variables: {
          event: {
            title,
            start: Math.floor(new Date(start).getTime() / 60000),
            end: Math.floor(new Date(end).getTime() / 60000),
            cid: cal,
            isDayEvent: false
          }
        }
      })
    } else {
      let r = await createCalendar({
        variables: {
          name: title
        }
      })

      updateApp(prev => {
        let visibleCals = [...prev.visibleCals]
        visibleCals.push(r.data.createCalendar)
        return {
          visibleCals
        }
      })
    }
  }

  return (
    <div
      style={{
        position: 'absolute',
        borderRadius: '0.5em',
        boxShadow: '0 10px 20px 5px rgba(0, 0, 0, 0.14)'
      }}
      className="add-event flex-col"
      ref={ref}
    >
      <div className="flex-row">
        <div className="clickable" onClick={() => setEvent(true)}>
          Event
        </div>
        <div className="clickable" onClick={() => setEvent(false)}>
          Calendar
        </div>
      </div>
      <input
        type="text"
        placeholder="title"
        onChange={e => setTitle(e.target.value)}
      ></input>
      {event ? (
        <>
          <input
            type="text"
            placeholder="start"
            onChange={e => setStart(e.target.value)}
          ></input>
          <input
            type="text"
            placeholder="end"
            onChange={e => setEnd(e.target.value)}
          ></input>
          <select onChange={e => setCal(e.target.value)}>
            {appState.calendars.map(x => (
              <option value={x.id} key={x.id}>
                {x.name}
              </option>
            ))}
          </select>
        </>
      ) : (
        <></>
      )}
      <button onClick={submit}>Submit</button>
    </div>
  )
}
