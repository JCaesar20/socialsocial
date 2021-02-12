const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    body:{
       type:String,
       trim:true,
       required:true
    },
    screamID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Scream'
    },
    userHandle: {
        type: String,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
})

const Comment = mongoose.model('Comment',commentSchema)


module.exports = Comment