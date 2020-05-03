import React, { useRef, useEffect, useState } from 'react'

export default function CurrLine() {
  const mins = () => {
    const now = new Date()
    return (now.getTime() / (60 * 1000) - now.getTimezoneOffset()) % (24 * 60)
  }
  const divRef = useRef(null)

  let [top, setTop] = useState((mins() / (60 * 24)) * 100)

  useEffect(() => {
    setTimeout(() => {
      setTop((mins() / (60 * 24)) * 100)
    }, 60 * 1000)
  })

  return (
    <div
      ref={divRef}
      style={{
        borderTop: '2px solid #CA002A',
        position: 'absolute',
        width: '100%',
        top: top + '%',
        zIndex: '2'
      }}
    ></div>
  )
}
