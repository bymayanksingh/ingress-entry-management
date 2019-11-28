const express = require('express')
const router = express.Router()
const Visitor = require('../models/Visitor')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth')

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'))

// Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const visitors = await Visitor.find()
    res.render('dashboard', { user: req.user, visitors: visitors })
  } catch (err) {
    console.log('cannot find visitors', err)
  }
})

router.post('/visitors', async (req, res) => {
  try 
  {
    if (req.body.name === '' | req.body.email === '' | req.body.phone === '' | req.body.host === '') {
      req.flash('error', 'fields cannot be empty')
      res.redirect('back')
      return
    }
    const visitor = new Visitor(req.body)
    await visitor.save()
    req.flash('success', `${visitor.name}, ${visitor.email},${visitor.phone}, ${visitor.host} have been added`)
    res.redirect('/dashboard')
  } 
  catch (error) 
  {
    req.flash('error', 'something went wrong')
    res.redirect('back')
  }
})

router.get("/visitor/:id", async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id)
    res.render("visitor", {visitor})
  }
  catch ( err )
  {
    console.log( err )
    req.flash('error', 'cannot find visitor')
    res.redirect('back')
  }
})


module.exports = router
