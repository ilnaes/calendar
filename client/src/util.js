// let todate = new Date()

function arrEqual(a, b) {
  if (!a || !b) return false
  if (a.length !== b.length) return false

  for (let i = 0; i < a.length; i++) {
    if (!isEquiv(a[i], b[i])) return false
  }

  return true
}

function isEquiv(a, b) {
  if (!a || !b) {
    return false
  }
  let aProps = Object.getOwnPropertyNames(a)
  let bProps = Object.getOwnPropertyNames(b)

  if (aProps.length !== bProps.length) {
    return false
  }

  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i]

    if (a[propName] !== b[propName]) {
      return false
    }
  }

  return true
}

function getDay(x) {
  return Math.floor(x / (60 * 24))
}

module.exports = {
  arrEqual,
  getDay
}
