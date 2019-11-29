
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')

const app = express()

require('dotenv').config()
require('./config/passport')(passport)
const db = require('./config/keys').mongoURI

mongoose
  .connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(function (req, res, next) {
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  next()
})
app.use('/', require('./routes/index.js'))
app.use('/hosts', require('./routes/hosts.js'))

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server started on port ${PORT}`))
