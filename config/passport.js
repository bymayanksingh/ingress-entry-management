const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

// Load Host model
const Host = require('../models/Host')

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match host
      Host.findOne({
        email: email
      }).then(host => {
        if (!host) {
          return done(null, false, { message: 'That email is not registered' })
        }

        // Match password
        bcrypt.compare(password, host.password, (err, isMatch) => {
          if (err) throw err
          if (isMatch) {
            return done(null, host)
          } else {
            return done(null, false, { message: 'Password incorrect' })
          }
        })
      })
    })
  )

  passport.serializeUser(function (host, done) {
    done(null, host.id)
  })

  passport.deserializeUser(function (id, done) {
    Host.findById(id, function (err, host) {
      done(err, host)
    })
  })
}
