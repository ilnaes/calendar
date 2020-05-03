import React, { useContext } from 'react'
import { AppContext } from '../context/appcontext'

export default function DayHeader(props) {
  const { appState } = useContext(AppContext)

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
                ? 'datepicker today-datepicker clickable'
                : 'datepicker clickable'
            }
          >
            {x.date}
          </div>
          <div
            style={{
              height: '3em',
              width: '100%',
              borderLeft: '1px solid #DDD',
              borderBottom: '1px solid #BBB'
            }}
          ></div>
        </div>
      ))}
    </div>
  )
}
