import React, { useRef, useState } from 'react'
import { EditEvent } from './editEvent'

export default function DayEventCard(props) {
  const [isEditing, setEditing] = useState(false)
  const divRef = useRef(null)

  return (
    <div
      ref={divRef}
      className="event-card clickable"
      style={{
        zIndex: '1',
        width: '95%',
        left: '0px',
        marginBottom: '0.1em',
        overflow: 'visible',
        textAlign: 'left'
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          padding: '0.3em 0.3em 0.3em 0.3em'
        }}
        onClick={() => {
          setEditing(true)
        }}
      >
        <b>{props.event.title}</b>
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
