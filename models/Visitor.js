const mongoose = require('mongoose')

const VisitorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Please provide a name',
    trim: true
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
