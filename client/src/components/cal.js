import React, { useContext, useEffect } from 'react'
import { AppProvider, AppContext } from '../context/appcontext'
import CalHeader from './header'
import Menu from './menu'
import CalBody from './body'

import { UserContext } from '../context/usercontext'
import { Redirect } from 'react-router-dom'
import { gql } from 'apollo-boost'
import { useQuery } from 'react-apollo'

export const GET_CALS = gql`
  query {
    calendars {
      id
      name
    }
  }
`
function arrEqual(a, b) {
  if (!a || !b) return false
  if (a.length !== b.length) return false

  for (let i = 0; i < a.length; i++) {
    if (a[i].id !== b[i].id || a[i].name !== b[i].name) return false
  }

  return true
}

export const CalBottom = () => {
  let { updateApp } = useContext(AppContext)

  const { loading, data } = useQuery(GET_CALS, { pollInterval: 2000 })

  useEffect(() => {
    let interval = setInterval(() => {
      updateApp(prev => {
        if (!loading) {
          let calendars = data.calendars.map(x => ({ id: x.id, name: x.name }))
          if (!arrEqual(prev.calendars, calendars))
            return {
              calendars
            }
        }
      })
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  })

  return (
    <div className="flex-row" style={{ minHeight: '0em' }}>
      <Menu />
      <CalBody />
    </div>
  )
}

export const Cal = () => {
  let { logoff } = useContext(UserContext)
  const { loading, error, data } = useQuery(GET_CALS)

  if (error) {
    logoff()
    return <Redirect to={{ pathname: '/login', state: { from: '/' } }} />
  }
  if (loading) {
    return <div>Loading...</div>
  }
  return (
    <AppProvider data={data.calendars.map(x => ({ id: x.id, name: x.name }))}>
      <div
        style={{
          height: '100vh'
        }}
        className="flex-col"
      >
        <CalHeader />
        <CalBottom />
      </div>
    </AppProvider>
  )
}
