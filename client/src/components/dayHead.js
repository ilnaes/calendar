import React, { useContext } from 'react'
import { AppContext } from '../context/appcontext'
import { getDay } from '../util'
import DayEventCard from './dayeventCard'

const MINSPERDAY = 60 * 24

export default function DayHeader(props) {
  const { appState } = useContext(AppContext)
  console.log('today: ' + props.today)

  return (
    <div
      style={{
        width: '100%'
      }}
      className="flex-row"
    >
      <div className="marker"></div>
      {props.days.map((x, i) => (
        <div key={x.day} className="day-col flex-col">
          <div
            className={
              appState.delta[appState.view] === 0 && i === props.today
                ? 'day-font today-font'
                : 'day-font'
            }
          >
            {x.day}
          </div>
          <div
            className={
              appState.delta[appState.view] === 0 && i === props.today
                ? 'datepicker circle today-datepicker clickable'
                : 'datepicker circle clickable'
            }
          >
            {x.date}
          </div>
          <div
            style={{
              minHeight: '1.5em',
              height: '100%',
              paddingLeft: '0.1em',
              width: '100%',
              borderLeft: '1px solid #DDD',
              borderBottom: '1px solid #BBB'
            }}
          >
            {props.events ? (
              props.events
                .filter(
                  x =>
                    !(
                      getDay(x.start) > getDay(props.start + i * MINSPERDAY) ||
                      getDay(x.end) < getDay(props.start + i * MINSPERDAY)
                    )
                )
                .map((x, i) => <DayEventCard key={i} event={x} />)
            ) : (
              <></>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
