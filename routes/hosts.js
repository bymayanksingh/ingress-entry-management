const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
// Load Host model
const Host = require('../models/Host')
const { forwardAuthenticated } = require('../config/auth')

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => {
  res.render('login', {
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg'),
    error: req.flash('error')
  })
})

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => {
  res.render('register', {
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg'),
    error: req.flash('error')
  })
})

// Register
router.post('/register', async (req, res) => {
  const { name, email, phone, address, password, password2 } = req.body
  let errors = []

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
    return res.render('register', {
      errors,
      name,
      email,
      phone,
      address,
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg'),
      error: req.flash('error')
    })
  }

  try {
    const existingHost = await Host.findOne({ email: email })
    if (existingHost) {
      errors.push({ msg: 'Email already exists' })
      return res.render('register', {
        errors,
        name,
        email,
        phone,
        address,
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg'),
        error: req.flash('error')
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newHost = new Host({
      name,
      email,
      phone,
      address,
      password: hashedPassword
    })

    await newHost.save()
    req.flash('success_msg', 'You are now registered and can log in')
    res.redirect('/hosts/login')
  } catch (err) {
    console.error(err)
    req.flash('error_msg', 'An error occurred during registration')
    res.redirect('/hosts/register')
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
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err)
      return next(err)
    }
    req.flash('success_msg', 'You are logged out')
    res.redirect('/hosts/login')
  })
})

module.exports = router