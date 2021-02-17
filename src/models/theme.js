const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
    themeName:{
       type:String,
       required:true,
       unique: true
    },
    createdBy: {
        type: String,
        required: true,
        ref: 'User'
    },
    members: [{
            userHandle: {
              type: String,
              required: true,
            }
    }],
    membersCount: {
        type: Number,
        default:1
    },
    description : {
        type: String
    }
},{
    timestamps: true
})

const Theme = mongoose.model('Theme',themeSchema)

module.exports = Theme