const nodemailer = require('nodemailer')
const express = require('express')
const router = express.Router()
const Nexmo = require('nexmo')
const Visitor = require('../models/Visitor')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
})

const nexmo = new Nexmo({
  apiKey: process.env.NEXMOAPIKEY,
  apiSecret: process.env.NEXMOAPISECRET
})

router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'))

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const visitors = await Visitor.find()
    res.render('dashboard', { user: req.user, visitors: visitors, logged_in_name: req.user.name })
  } catch (err) {
    console.log('cannot find visitors', err)
  }
})

router.post('/visitors', async (req, res) => {
  try {
    if (req.body.name === '' | req.body.email === '' | req.body.phone === '' | req.body.host === '') {
      req.flash('error', 'fields cannot be empty')
      res.redirect('back')
      return
    }
    const visitor = new Visitor(req.body)
    await visitor.save()
    req.flash('success', `${visitor.name}, ${visitor.email},${visitor.phone} added`)
    res.redirect('/dashboard')
  } catch (error) {
    req.flash('error', 'something went wrong')
    res.redirect('back')
  }
})

router.post('/visitor/:id/checkin', async (req, res) => {
  try {
    const data = {
      checkin: Date.now()
    }
    const visitor = await Visitor.findById(req.params.id)
    // if already checked in don't allow to checkin
    if (visitor.entry && visitor.entry.length > 0) {
      const lastCheckIn = visitor.entry[visitor.entry.length - 1]
      const lastCheckInTimestamp = lastCheckIn.checkin.getTime()
      if (Date.now() > lastCheckInTimestamp + 100) {
        req.flash('error', `${visitor.name} has checked in for today already`)
        res.redirect('/dashboard')
      }
    } else {
      visitor.entry.push(data)
      await visitor.save()
      req.flash('success', `${visitor.name} checked in for today successfully, email & sms sent to host`)

      var hostEmail = req.user.email
      var visitorName = visitor.name
      var visitorEmail = visitor.email
      var visitorPhone = visitor.phone
      var lastCheck = visitor.entry[visitor.entry.length - 1]
      var visitorCheckin = lastCheck.checkin.getTime()
      var dateIST = new Date(visitorCheckin)
      dateIST.setHours(dateIST.getHours() + 5)
      dateIST.setMinutes(dateIST.getMinutes() + 30)
      var message = 'New Checkin:\n' + 'Name: ' + visitorName + '\nEmail: ' + visitorEmail + '\nPhone: ' + visitorPhone + '\nCheckin: ' + dateIST.toGMTString()

      var mailOptions = {
        from: process.env.EMAIL,
        to: hostEmail,
        subject: 'Mail sent using Ingress - Entry Management Application',
        text: message
      }

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err)
        } else {
          console.log('email sent: ' + info.response)
        }
      })

      const from = 'Ingress'
      const to = '91' + req.user.phone
      const text = message
      console.log(to.trim(), text)

      nexmo.message.sendSms(from, to, text, (err, info) => {
        if (err) {
          console.log(err)
        } else {
          if (info.messages[0].status === '0') {
            console.log('Message sent successfully.')
          } else {
            console.log(`Message failed with error: ${info.messages[0]['error-text']}`)
          }
        }
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.log('something went wrong', err)
  }
})

router.post('/visitor/:id/checkout', async (req, res) => {
  try {
    const visitor = await Visitor.findOne({ _id: req.params.id })
    if (visitor.entry && visitor.entry.length > 0) {
      const lastEntry = visitor.entry[visitor.entry.length - 1]
      if (lastEntry.checkout.time) {
        req.flash('error', `${visitor.name} already checked out`)
        res.redirect('/dashboard')
        return
      }
      lastEntry.checkout.time = Date.now()
      await visitor.save()
      req.flash('success', `${visitor.name} successfully checked out, email sent to visitor`)

      // Name
      var visitorName = visitor.name
      // Phone
      var visitorPhone = visitor.phone
      // Email
      var visitorEmail = visitor.email
      // Check-in time
      var lastCheck = visitor.entry[visitor.entry.length - 1]
      var visitorCheckin = lastCheck.checkin.getTime()
      var dateIST = new Date(visitorCheckin)
      dateIST.setHours(dateIST.getHours() + 5)
      dateIST.setMinutes(dateIST.getMinutes() + 30)
      var dateISTCheckin = dateIST.toGMTString()
      // Check-out time
      var visitorCheckout = lastCheck.checkout.time.getTime()
      var dateISTCheckout = new Date(visitorCheckout)
      dateISTCheckout.setHours(dateISTCheckout.getHours() + 5)
      dateISTCheckout.setMinutes(dateISTCheckout.getMinutes() + 30)

      // Host name
      var hostName = req.user.name
      // Host email
      var hostEmail = req.user.email
      // Address visited
      var hostAddress = req.user.address

      var message = 'You have successfully checked out: \n\n' + 'Name: ' + visitorName + '\nPhone: ' + visitorPhone + '\nCheckin: ' + dateISTCheckin + '\nCheckout: ' + dateISTCheckout.toGMTString() + '\nHost Name: ' + hostName + '\nHost Email: ' + hostEmail + '\nHost Address: ' + hostAddress

      var mailOptions = {
        from: process.env.EMAIL,
        to: visitorEmail,
        subject: 'Mail sent using Ingress - Entry Management Application',
        text: message
      }

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err)
        } else {
          console.log('email sent: ' + info.response)
        }
      })

      res.redirect('/dashboard')
    } else {
      req.flash('error', `${visitor.name} does not have any check in entry`)
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.log('something went wrong', err)
  }
})

module.exports = router
