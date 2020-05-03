const {
  GraphQLSchema,
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
  GraphQLInputObjectType
} = require('graphql')
const {
  createCalendarResolver,
  deleteCalendarResolver,
  createEventResolver,
  searchEventResolver,
  deleteEventResolver
} = require('./resolvers')
const { ObjectID } = require('mongodb')

const EventSearch = new GraphQLInputObjectType({
  name: 'EventSearch',
  fields: () => ({
    start: {
      type: GraphQLInt
    },
    end: {
      type: GraphQLInt
    },
    title: {
      type: GraphQLString
    },
    cids: {
      type: new GraphQLList(GraphQLString)
    }
  })
})

const EventInput = new GraphQLInputObjectType({
  name: 'EventInput',
  fields: () => ({
    start: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    end: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    title: {
      type: new GraphQLNonNull(GraphQLString)
    },
    isDayEvent: {
      type: new GraphQLNonNull(GraphQLBoolean)
    },
    cid: {
      type: new GraphQLNonNull(GraphQLString)
    },
    description: {
      type: GraphQLString
    }
  })
})

const Event = new GraphQLObjectType({
  name: 'DateEvent',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString)
    },
    creator: {
      type: new GraphQLNonNull(User)
    },
    title: {
      type: new GraphQLNonNull(GraphQLString)
    },
    start: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    end: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    isDayEvent: {
      type: new GraphQLNonNull(GraphQLBoolean)
    },
    cid: {
      type: new GraphQLNonNull(GraphQLString)
    },
    description: {
      type: GraphQLString
    }
  })
})

const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      async resolve(p, _, context) {
        users = context.db.collection('users')
        let u = await users.findOne({ _id: new ObjectID(p.id) })
        return u.username
      }
    },
    calendars: {
      type: new GraphQLNonNull(new GraphQLList(Calendar)),
      async resolve(p, _, context) {
        users = context.db.collection('users')
        let u = await users.findOne({ _id: new ObjectID(p.id) })
        return u.calendars.map(x => ({ id: x }))
      }
    }
  })
})

const Calendar = new GraphQLObjectType({
  name: 'Calendar',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      async resolve(p, a, context) {
        cals = context.db.collection('calendars')
        let u = await cals.findOne({ _id: new ObjectID(p.id) })
        return u.name
      }
    },
    creator: {
      type: new GraphQLNonNull(User),
      async resolve(p, a, context) {
        cals = context.db.collection('calendars')
        let u = await cals.findOne({ _id: new ObjectID(p.id) })
        return { id: u.creator }
      }
    },
    events: {
      type: new GraphQLList(Event),
      async resolve(_p, _a, context) {
        cals = context.db.collection('calendars')
        let u = await cals.findOne({ _id: new ObjectID(p.id) })
        return { id: u.events }
      }
    }
  })
})

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    calendars: {
      type: new GraphQLList(Calendar),
      async resolve(_p, _a, context) {
        let r = await context.db
          .collection('calendars')
          .find({ creator: context.userid })
        let ar = await r.toArray()
        return ar.map(x => {
          x.id = x._id.toString()
          return x
        })
      }
    },
    searchEvents: {
      type: new GraphQLList(Event),
      args: {
        params: {
          type: new GraphQLNonNull(EventSearch)
        }
      },
      async resolve(_p, args, context) {
        return await searchEventResolver(context.userid, args, context.mongo)
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createCalendar: {
      // type: GraphQLString,
      type: GraphQLID,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      async resolve(_, { name }, context) {
        return await createCalendarResolver(context.userid, name, context.mongo)
      }
    },
    deleteCalendar: {
      type: GraphQLBoolean,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      async resolve(_, { name }, context) {
        return await deleteCalendarResolver(context.userid, name, context.mongo)
      }
    },
    createEvent: {
      type: GraphQLID,
      args: {
        event: {
          type: new GraphQLNonNull(EventInput)
        }
      },
      async resolve(_, args, context) {
        return await createEventResolver(
          context.userid,
          args.event,
          context.mongo
        )
      }
    },
    deleteEvent: {
      type: GraphQLBoolean,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      async resolve(_, { id }, context) {
        return await deleteEventResolver(context.userid, id, context.mongo)
      }
    }
  }
})

const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
})

module.exports = schema
