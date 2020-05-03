import React, { useRef, useState } from 'react'
import { EditEvent } from './editEvent'

export default function EventCard(props) {
  const [isEditing, setEditing] = useState(false)
  const divRef = useRef(null)

  const offset = new Date().getTimezoneOffset()
  const getHour = x => ((x - offset) % (60 * 24)) / 60
  const height = ((props.event.end - props.event.start) * 100) / (60 * 24)
  const top = (((props.event.start - offset) % (60 * 24)) / (60 * 24)) * 100

  return (
    <div
      ref={divRef}
      className="event-card clickable"
      style={{
        zIndex: '1',
        top: top + '%',
        width: '95%',
        left: '0px',
        position: 'absolute',
        height: height + '%',
        overflow: 'visible'
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          padding: '0em 0.3em 0em 0.3em'
        }}
        onClick={() => {
          setEditing(true)
        }}
      >
        <b>{props.event.title}</b>
        <br /> {Math.floor(getHour(props.event.start))}
      </div>
      {isEditing ? (
        <EditEvent
          left="0"
          top="0"
          stop={() => {
            setEditing(false)
          }}
          event={props.event}
        />
      ) : null}
    </div>
  )
}
