import React, { useContext, useEffect, useRef } from 'react'
import { AppContext } from '../context/appcontext'
import { useQuery } from 'react-apollo'
import { gql } from 'apollo-boost'
import { DaytimeCol } from './daytimeCol'
import DayHeader from './dayHead'
import { CreateEvent } from './createEvent'
import Markers from './markers'
import { arrEqual, getDay, toSat, toSun } from '../util'

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

export default function CalBody() {
  const divRef = useRef(null)
  let { appState, updateApp } = useContext(AppContext)

  let basedate = new Date()
  let today = basedate.getDay()
  basedate.setDate(basedate.getDate() + 7 * appState.delta.week)

  const sun = toSun(basedate)
  sun.setHours(0)
  sun.setMinutes(0)
  const start = Math.floor(sun.getTime() / MILLIPERMIN) // minutes

  const sat = toSat(basedate)
  sat.setHours(23)
  sat.setMinutes(59)
  const end = Math.floor(sat.getTime() / MILLIPERMIN)

  const { loading, data } = useQuery(GET_EVENTS, {
    variables: {
      params: { start, end, cids: appState.calendars.map(x => x.id) }
    },
    pollInterval: 2000
  })

  // initial scroll of calendar
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

  // memoize events in the appState
  useEffect(() => {
    let interval = setInterval(() => {
      if (!loading) {
        updateApp(prev => {
          let events = prev.events[prev.view + prev.delta[prev.view]]
          if (!arrEqual(events, data.searchEvents)) {
            let res = { ...prev.events }
            res[prev.view + prev.delta[prev.view]] = data.searchEvents
            return { events: res }
          }
        })
      }
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  })

  let getDate = i => {
    let x = new Date(sun)
    x.setDate(sun.getDate() + i)
    return x.getDate()
  }

  let index = appState.view + appState.delta[appState.view]
  let display = appState.events[index]
    ? appState.events[index].filter(x => appState.visibleCals.includes(x.cid))
    : null

  let dayEvents = null
  if (display) {
    dayEvents = display.filter(
      x => getDay(x.start) !== getDay(x.end) // TODO: isDayEvent
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}
    >
      <DayHeader
        today={today}
        days={days.map((x, i) => ({
          day: x,
          date: getDate(i)
        }))}
        events={dayEvents}
        start={start}
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
          {appState.isCreating ? <CreateEvent /> : <></>}
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
