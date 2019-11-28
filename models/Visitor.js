const mongoose = require('mongoose')

const VisitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: Number,
    required: true,
  },
  host:{
    type: String,
    required: true
  },
  attendance: [{
    date: {
      type: Date,
      default: Date.now
    },
    entry: {
      type: Date
    },
    exit: {
      time: {
        type: Date
      }
    }
  }]
}, {
  usePushEach: true
})

module.exports = mongoose.model('Visitor', VisitorSchema)
