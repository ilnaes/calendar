import React, { useRef, useEffect } from 'react'
import { useMutation } from 'react-apollo'
import { gql } from 'apollo-boost'

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: String!) {
    deleteEvent(id: $id)
  }
`

export function EditEvent(props) {
  let [deleteEvent] = useMutation(DELETE_EVENT)

  const ref = useRef(null)

  let handleClick = e => {
    if (ref.current && !ref.current.contains(e.target)) {
      props.stop()
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClick)

    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  })

  let submit = () => {
    props.stop()
    deleteEvent({
      variables: {
        id: props.event.id
      }
    })
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: props.left,
        top: props.top,
        borderRadius: '0.5em',
        boxShadow: '0 10px 20px 5px rgba(0, 0, 0, 0.14)'
      }}
      className="edit-event flex-col"
      ref={ref}
    >
      {props.event.id}
      <button onClick={submit}>Delete</button>
    </div>
  )
}
