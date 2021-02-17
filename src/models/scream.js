const mongoose = require('mongoose');

const screamSchema = new mongoose.Schema({
    body:{
       type:String,
       trim:true,
       required:true
    },
    owner: {
        type: String,
        required: true,
        ref: 'User'
    },
    likeCount: {
        type: Number,
        default:0
    },
    commentCount:{
        type: Number,
        default:0
    },
    themeName: {
        type: String
    }
},{
    timestamps: true
})

screamSchema.virtual('comments',{
    ref: 'Comment',
    localField: '_id',
    foreignField: 'screamID'
})

screamSchema.virtual('likes',{
    ref: 'Like',
    localField: '_id',
    foreignField: 'screamID'
})

screamSchema.virtual('notifications',{
    ref: 'Notification',
    localField: '_id',
    foreignField: 'screamID'
})




const Scream = mongoose.model('Scream',screamSchema)


module.exports = Scream