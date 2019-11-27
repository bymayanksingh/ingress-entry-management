const mongoose = require('mongoose');

const HostSchema = new  mongoose.Schema({
    //name
    name: {
        type:String,
        required: 'You must supply a name',
        trim: true
    },
    //email
    email: {
        type:String,
        required: true
    },
    //phone no
    phone: {
        type:Number,
        required: true
    },
    //address
    address:{
        type:String,
        required: true
    },
    //password
    password: {
        type:String,
        required: true
    },
    //attendance
    attendance:[{
        date:{
            type:Date,
            default:Date.now,
        },
        entry:{
            type:Date
        },
        exit:{
            time:{
                type:Date
            }
        }
    }]
}, {
    usePushEach: true
});

module.exports = mongoose.model('User', HostSchema);