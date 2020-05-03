const express = require('express')
const morgan = require('morgan')
const graphqlHTTP = require('express-graphql')
const auth = require('./auth')
const bodyParser = require('body-parser')
const passport = require('passport')
const cors = require('cors')
const { ObjectID } = require('mongodb')
const dotenv = require('dotenv')
dotenv.config()

const schema = require('./schema')

const app = express()
app.use(cors())
// app.use(morgan('common'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const MongoClient = require('mongodb').MongoClient
const client = MongoClient(process.env.MONGODB_URI, {
  useUnifiedTopology: true
})
const dbName = 'calendar'

function authJWT(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, userid) => {
    if (err) {
      return res.send('BAD')
    }
    req.userid = userid
    next()
  })(req, res)
}

;(async function() {
  await client.connect()
  const db = client.db(dbName)

  auth(app, client)

  app.use('/graphql', authJWT, async (req, res, next) => {
    if (req.userid) {
      let u = await db
        .collection('users')
        .findOne({ _id: new ObjectID(req.userid) })
      if (!u) {
        res.status(401).json({ error: 'unauthorized' })
      } else {
        graphqlHTTP({
          schema: schema,
          graphiql: true,
          context: { userid: req.userid, db, mongo: client }
        })(req, res)
      }
    } else {
      res.status(401).json({ error: 'unauthorized' })
    }
  })

  app.listen(process.env.PORT || 4000, () => {
    console.log('Listening on port ' + (process.env.PORT || 4000))
  })
})()
