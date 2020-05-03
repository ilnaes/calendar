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
  let month = props.month
  let year = 1900 + props.year

  if (month < 0 || month > 11) {
    year += Math.floor(month / 12)
    month = month % 12

    if (month < 0) {
      month += 12
    }
  }

  let base = new Date(`${month + 1}/1/${year}`)
  let start = toSun(base)

  let getDay = delta => {
    let x = new Date(start)
    x.setDate(start.getDate() + delta)

    let style = {
      fontWeight: '500',
      padding: '0.4em 0.3em 0.4em 0.3em',
      margin: '0.15em'
    }
    if (x.getMonth() !== props.month) {
      style['color'] = '#888'
    }
    return (
      <div
        className="day-font circle clickable"
        style={style}
        onClick={() => props.callback(x)}
      >
        {x.getDate()}
      </div>
    )
  }

  return (
    <div>
      <div
        style={{
          paddingLeft: '0.3em',
          paddingRight: '0.5em',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        <div>
          {months[month]} {year}
        </div>
        <div style={{ flex: 1 }}>&nbsp;</div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            fontSize: '1.5em'
          }}
        >
          <div onClick={props.decr} className="clickable">
            &#8249;
          </div>
          &nbsp;
          <div onClick={props.incr} className="clickable">
            &#8250;
          </div>
        </div>
      </div>
      <table
        style={{
          width: '100%'
        }}
      >
        <tbody>
          <tr style={{ paddingTop: '0.5em' }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((x, i) => (
              <th key={'day' + i}>
                <div
                  key={'divday' + i}
                  className="day-font"
                  style={{ color: '#888' }}
                >
                  {x}
                </div>
              </th>
            ))}
          </tr>
          {[0, 1, 2, 3, 4, 5].map(w => (
            <tr style={{ paddingTop: '0.5em' }} key={'week' + w}>
              {[0, 1, 2, 3, 4, 5, 6].map(d => (
                <th key={'day' + 7 * w + d}>{getDay(7 * w + d)}</th>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
