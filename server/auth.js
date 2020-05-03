const passport = require('passport')
const LocalStrategy = require('passport-local')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { createCalendarResolver } = require('./resolvers')
const dotenv = require('dotenv')
dotenv.config()

function createJWTToken(user) {
  return jwt.sign({ userid: user._id }, process.env.SESSION_SECRET, {
    expiresIn: process.env.EXPIRY
  })
}

function auth(app, mongo) {
  const db = mongo.db('calendar')
  const users = db.collection('users')

  app.use(passport.initialize())

  passport.use(
    new LocalStrategy(async function(username, password, done) {
      try {
        let user = await users.findOne({ username: username })
        if (!user) {
          return done(null, false)
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false)
        }
        return done(null, user)
      } catch (err) {
        console.log(err)
        return done(err)
      }
    })
  )

  passport.use(
    new JwtStrategy(
      {
        secretOrKey: process.env.SESSION_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
      },
      (token, done) => {
        done(null, token.userid)
      }
    )
  )

  app.route('/login').post((req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        res.status(401).send('ERROR')
      }
      if (!user) {
        return res.status(401).json({ message: 'BAD' })
      }

      let token = createJWTToken(user)
      res.json({ token })
    })(req, res)
  })

  app.route('/register').post(async (req, res, next) => {
    const hash = await bcrypt.hash(req.body.password, 12)

    token = null
    const r = await users.updateOne(
      {
        username: req.body.username
      },
      {
        $setOnInsert: {
          password: hash,
          calendars: []
        }
      },
      {
        upsert: true
      }
    )
    if (r.matchedCount == 0) {
      const uid = r.upsertedId._id.toString()
      const cid = await createCalendarResolver(uid, req.body.username, mongo)

      if (cid) {
        token = createJWTToken({ _id: uid })
      }
    }

    if (token) {
      res.status(201).json({ token })
    } else {
      res.status(401).send('ALREADY EXISTS')
    }
  })
}

module.exports = auth
