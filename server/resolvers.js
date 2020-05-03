const { ObjectID } = require('mongodb')

exports.searchEventResolver = async (uid, args, client) => {
  const events = client.db('calendar').collection('events')
  const users = client.db('calendar').collection('users')
  let filters = {
    start: { $gte: args.params.start, $lte: args.params.end }
  }
  if (args.params.cids) {
    filters.cid = {
      $in: args.params.cids
    }
  }

  let user = await users.findOne({ _id: new ObjectID(uid) })
  if (!user || !args.params.cids.every(x => user.calendars.includes(x))) {
    return null
  }

  let r = await events.find(filters)
  if (!r) {
    return null
  }

  let ar = await r.toArray()

  if (ar) {
    return ar.map(x => {
      x.id = x._id.toString()
      return x
    })
  } else {
    return null
  }
}

exports.deleteEventResolver = async (uid, id, client) => {
  let cals = client.db('calendar').collection('calendars')
  let events = client.db('calendar').collection('events')

  let result = true

  const session = client.startSession()
  await session.withTransaction(async () => {
    let r = await events.findOneAndDelete(
      {
        creator: uid,
        _id: new ObjectID(id)
      },
      { session }
    )
    if (r.value) {
      await cals.findOneAndUpdate(
        { _id: new ObjectID(r.value.cid) },
        { $pull: { events: r.value._id.toString() } },
        { session }
      )
      result = true
    }
  })
  session.endSession()

  return result
}

exports.createEventResolver = async (uid, args, client) => {
  let cals = client.db('calendar').collection('calendars')
  let events = client.db('calendar').collection('events')

  let result = null

  const session = client.startSession()
  await session.withTransaction(async () => {
    let r = await events.insertOne(
      {
        creator: uid,
        title: args.title,
        start: args.start,
        end: args.end,
        isDayEvent: args.isDayEvent,
        cid: args.cid,
        description: args.description
      },
      { session }
    )
    await cals.findOneAndUpdate(
      { _id: new ObjectID(args.cid) },
      { $push: { events: r.insertedId.toString() } },
      { session }
    )
    result = r.insertedId.toString()
  })
  session.endSession()

  return result
}

exports.createCalendarResolver = async (uid, name, client) => {
  let cals = client.db('calendar').collection('calendars')
  let users = client.db('calendar').collection('users')

  let result = null

  const session = client.startSession()
  await session.withTransaction(async () => {
    let r = await cals.updateOne(
      { name, creator: uid },
      { $setOnInsert: { events: [] } },
      { upsert: true, session }
    )
    if (r.matchedCount == 0) {
      await users.findOneAndUpdate(
        { _id: new ObjectID(uid) },
        { $push: { calendars: r.upsertedId._id.toString() } },
        { session }
      )
      result = r.upsertedId._id.toString()
    }
  })
  session.endSession()

  return result
}

exports.deleteCalendarResolver = async (uid, name, client) => {
  cals = client.db('calendar').collection('calendars')
  users = client.db('calendar').collection('users')

  result = false

  let session = client.startSession()
  try {
    await session.withTransaction(async () => {
      let r = await cals.findOneAndDelete(
        {
          name,
          creator: uid
        },
        { session }
      )
      if (r.value) {
        await users.findOneAndUpdate(
          { _id: new ObjectID(uid) },
          { $pull: { calendars: r.value._id.toString() } },
          { session }
        )
        result = true
      }
    })
  } finally {
    session.endSession()
  }
  return result
}
