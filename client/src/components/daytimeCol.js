import React, { useRef } from 'react'
import EventCard from './eventCard'
import CurrLine from './currline'

let hours = []
for (let i = 0; i < 24; i++) {
  hours.push(i)
}

export const DaytimeCol = props => {
  let divElement = useRef(null)

  let getDay = x => Math.floor((x - props.start) / (60 * 24))

  let dayEvents = props.events
    ? props.events.filter(x => getDay(x.start) === props.day)
    : null

  const mins =
    new Date().getTime() / (60 * 1000) - props.day * 24 * 60 - props.start
  const showLine = mins >= 0 && mins < 24 * 60

  return (
    <div
      style={{
        minWidth: '5em',
        width: '100%',
        position: 'relative',
        height: '100%'
      }}
    >
      {showLine ? <CurrLine /> : null}
      {hours.map(i => (
        <div
          ref={i === 0 ? divElement : null}
          key={i}
          style={{
            borderLeft: '1px solid #DDD',
            borderBottom: '1px solid #DDD',
            minHeight: '3em'
          }}
        ></div>
      ))}
      {dayEvents
        ? dayEvents.map((x, i) => <EventCard key={i} event={x} />)
        : null}
    </div>
  )
}
