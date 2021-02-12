const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
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


likeSchema.methods.toJSON = function () {
    const user = this;
    const publicuser = user.toObject();

    delete publicuser._id
    delete publicuser.createdAt
    delete publicuser.updatedAt
    delete publicuser.__v
    return publicuser
}

const Like = mongoose.model('Like',likeSchema)


module.exports = Like