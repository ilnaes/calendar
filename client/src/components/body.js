import React, { useContext, useEffect, useRef } from 'react'
import { AppContext } from '../context/appcontext'
import { useQuery } from 'react-apollo'
import { gql } from 'apollo-boost'
import { DaytimeCol } from './daytimeCol'
import DayHeader from './dayHead'
import { CreateEvent } from './createEvent'
import Markers from './markers'

const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const MILLIPERMIN = 60 * 1000
const GET_EVENTS = gql`
  query GetEvents($params: EventSearch!) {
    searchEvents(params: $params) {
      start
      end
      title
      cid
      id
    }
  }
`

function arrEqual(a, b) {
  if (!a || !b) return false
  if (a.length !== b.length) return false

  for (let i = 0; i < a.length; i++) {
    if (!isEquiv(a[i], b[i])) return false
  }

  return true
}

function isEquiv(a, b) {
  if (!a || !b) {
    return false
  }
  let aProps = Object.getOwnPropertyNames(a)
  let bProps = Object.getOwnPropertyNames(b)

  if (aProps.length !== bProps.length) {
    return false
  }

  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i]

    if (a[propName] !== b[propName]) {
      return false
    }
  }

  return true
}

export default function CalBody() {
  const divRef = useRef(null)
  let { appState, updateApp } = useContext(AppContext)

  const todate = new Date()
  const today = todate.getDay()

  const sun = new Date(todate)
  sun.setHours(0)
  sun.setMinutes(0)
  sun.setDate(todate.getDate() + 7 * appState.delta.week - today)
  const start = Math.floor(sun.getTime() / MILLIPERMIN)

  const sat = new Date(todate)
  sat.setHours(23)
  sat.setMinutes(59)
  sat.setDate(todate.getDate() + 7 * appState.delta.week + 7 - today)
  const end = Math.floor(sat.getTime() / MILLIPERMIN)

  const { loading, data } = useQuery(GET_EVENTS, {
    variables: {
      params: { start, end, cids: appState.calendars.map(x => x.id) }
    },
    pollInterval: 2000
  })

  let getDate = i => {
    let x = new Date(todate)
    x.setDate(todate.getDate() + i)
    return x.getDate()
  }

  let index = appState.view + appState.delta[appState.view]
  let display = appState.events[index]
    ? appState.events[index]
    : loading
    ? null
    : data.searchEvents

  useEffect(() => {
    const now = new Date()
    let tohourMin =
      ((Math.floor(now.getTime() / (60 * 1000)) % (60 * 24)) -
        now.getTimezoneOffset()) /
      60
    if (tohourMin < 0) {
      tohourMin += 24
    }

    if (divRef.current) {
      divRef.current.scrollTop =
        (divRef.current.scrollHeight * Math.max(0, tohourMin - 2)) / 24
    }
  }, [divRef])

  useEffect(() => {
    let interval = setInterval(() => {
      updateApp(prev => {
        if (!loading) {
          let events = prev.events[prev.view + prev.delta[prev.view]]
          if (!arrEqual(events, data.searchEvents)) {
            let res = { ...prev.events }
            res[prev.view + prev.delta[prev.view]] = data.searchEvents
            return { events: res }
          }
        }
      })
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}
    >
      {appState.isCreating ? <CreateEvent /> : <></>}
      <DayHeader
        today={today}
        days={days.map((x, i) => ({
          day: x,
          date: getDate(i - today + appState.delta.week * 7)
        }))}
      />
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'auto'
        }}
        ref={divRef}
      >
        <div className="flex-row">
          <Markers />
          <div
            className="flex-row"
            style={{ width: '100%', position: 'relative' }}
          >
            {days.map((x, i) => (
              <DaytimeCol
                key={x}
                day={i}
                start={start}
                events={
                  display
                    ? display.filter(x => appState.visibleCals.includes(x.cid))
                    : null
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
