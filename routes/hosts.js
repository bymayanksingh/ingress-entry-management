const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
// Load Host model
const Host = require('../models/Host')
const { forwardAuthenticated } = require('../config/auth')

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'))

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'))

// Register
router.post('/register', (req, res) => {
  const { name, email, phone, address, password, password2 } = req.body
  const errors = []

  if (!name || !email || !phone || !address || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' })
  }

  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' })
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' })
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      phone,
      address,
      password,
      password2
    })
  } else {
    Host.findOne({ email: email }).then(host => {
      if (host) {
        errors.push({ msg: 'Email already exists' })
        res.render('register', {
          errors,
          name,
          email,
          phone,
          address,
          password,
          password2
        })
      } else {
        const newHost = new Host({
          name,
          email,
          phone,
          address,
          password
        })

        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err
          bcrypt.hash(newHost.password, salt, (err, hash) => {
            if (err) throw err
            newHost.password = hash
            newHost
              .save()
              .then(host => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                )
                res.redirect('/hosts/login')
              })
              .catch(err => console.log(err))
          })
        })
      }
    })
  }
})

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/hosts/login',
    failureFlash: true
  })(req, res, next)
})

// Logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You are logged out')
  res.redirect('/hosts/login')
})

module.exports = router
