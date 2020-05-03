import React from 'react'

let hours = []
for (let i = 0; i < 24; i++) {
  hours.push(i)
}

export default function Marker() {
  return (
    <div className="marker flex-row">
      <div
        style={{
          width: '100%'
        }}
      >
        {hours.map(i => (
          <div
            key={i}
            style={{
              minHeight: '3em',
              position: 'relative',
              borderBottom: '1px solid white'
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: '-0.5em',
                right: '0.7em',
                fontSize: '0.65em',
                color: '#777'
              }}
            >
              {i !== 23
                ? (i % 12) + 1 + ((i + 1) / 12 >= 1 ? ' PM' : ' AM')
                : ''}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          width: '0.5em'
        }}
      >
        {hours.map(i => (
          <div
            key={i}
            style={{
              borderBottom: '1px solid #DDD',
              minHeight: '3em'
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}
