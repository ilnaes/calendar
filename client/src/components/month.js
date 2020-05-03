import React from 'react'
import { toSun } from '../util'

const months = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER'
]

// need props.month and props.year
export default function MonthCard(props) {
  let base = new Date(`${props.month}/1/${props.year}`)
  let start = toSun(base)

  let getDay = delta => {
    let x = new Date(start)
    x.setDate(start.getDate() + delta)

    let style = {
      fontWeight: '500'
    }
    if (x.getMonth() !== props.month - 1) {
      style['color'] = '#888'
    }
    return (
      <div
        className="day-font clickable"
        style={style}
        onClick={() => props.callback(x)}
      >
        {x.getDate()}
      </div>
    )
  }

  return (
    <div>
      <div style={{ paddingLeft: '0.2em' }}>
        {months[props.month - 1]} {props.year}
      </div>
      <table
        style={{
          borderCollapse: 'separate',
          borderSpacing: '0 1em',
          width: '100%'
        }}
      >
        <tr style={{ paddingTop: '0.5em' }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(x => (
            <th>
              <div className="day-font" style={{ color: '#888' }}>
                {x}
              </div>
            </th>
          ))}
        </tr>
        {[0, 1, 2, 3, 4, 5].map(w => (
          <tr style={{ paddingTop: '0.5em' }}>
            {[0, 1, 2, 3, 4, 5, 6].map(d => (
              <th>{getDay(7 * w + d)}</th>
            ))}
          </tr>
        ))}
      </table>
    </div>
  )
}
