import React from 'react'

const views = {
  WEEK: 'week',
  DAY: 'day',
  MONTH: 'month'
}

export const init = {
  view: views.WEEK,
  isMenuVisible: true,
  delta: {
    week: 0,
    month: 0
  },
  visibleCals: [],
  calendars: [],
  isCreating: null, // TODO: rename this
  events: {}
}

export const AppContext = React.createContext({})

export class AppProvider extends React.Component {
  constructor(props) {
    super(props)

    init.calendars = props.data
    init.visibleCals = props.data.map(x => x.id)
    this.state = init

    this.toggleMenu = this.toggleMenu.bind(this)
    this.incrDelta = this.incrDelta.bind(this)
    this.decrDelta = this.decrDelta.bind(this)
    this.zeroDelta = this.zeroDelta.bind(this)
    this.setState = this.setState.bind(this)
    this.toggleVisible = this.toggleVisible.bind(this)
  }

  toggleVisible(cid) {
    this.setState(prev => {
      if (prev.visibleCals.includes(cid)) {
        return { visibleCals: prev.visibleCals.filter(x => x !== cid) }
      } else {
        return { visibleCals: prev.visibleCals.concat(cid) }
      }
    })
  }

  toggleMenu() {
    this.setState(prev => ({
      isMenuVisible: !prev.isMenuVisible
    }))
  }

  incrDelta(mode) {
    this.setState(prev => {
      let resDelta = prev.delta
      resDelta[mode]++
      return { delta: resDelta }
    })
  }

  decrDelta(mode) {
    this.setState(prev => {
      let resDelta = prev.delta
      resDelta[mode]--
      return { delta: resDelta }
    })
  }

  zeroDelta() {
    this.setState(prev => {
      let resDelta = prev.delta
      resDelta['week'] = 0
      resDelta['month'] = 0
      return { delta: resDelta }
    })
  }

  render() {
    return (
      <AppContext.Provider
        value={{
          appState: this.state,
          updateApp: this.setState,
          toggleMenu: this.toggleMenu,
          incrDelta: this.incrDelta,
          decrDelta: this.decrDelta,
          zeroDelta: this.zeroDelta,
          toggleVisible: this.toggleVisible
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    )
  }
}
