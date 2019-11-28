const mongoose = require('mongoose')

const HostSchema = new mongoose.Schema({
  // name
  name: {
    type: String,
    required: 'You must supply a name',
    trim: true
  },
  // email
  email: {
    type: String,
    required: true
  },
  // phone no
  phone: {
    type: Number,
    required: true
  },
  // address
  address: {
    type: String,
    required: true
  },
  // password
  password: {
    type: String,
    required: true
  },
  // date
  date: {
    type: Date,
    default: Date.now
  }

}, {
  usePushEach: true
})

module.exports = mongoose.model('User', HostSchema)
