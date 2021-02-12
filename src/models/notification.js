const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: String,
        required: true,
        ref: 'User'
    },
    sender: {
        type: String,
        required: true,
        ref: 'User'
    },
    read:{
       type:Boolean,
       default: false
    },
    screamID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Scream'
    },
    type: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

const Notification = mongoose.model('Notification',notificationSchema)


module.exports = Notification