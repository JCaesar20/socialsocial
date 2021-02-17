const bcrypt = require('bcryptjs')
const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Scream = require('./scream')

const userSchema = new mongoose.Schema({
    userHandle:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    Email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Wrong format of an E-mail")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim:true,
        minlength:7,
        validate(value){
            if(validator.contains(value.toLowerCase(),'password') ){
                throw new Error("Wrong format of Password");
            }
        }
    },bio: {
        type:String,
        trim:true,
        default:''
    },website: {
        type:String,
        trim:true,
        default:'',
        validate(value){
            if(!validator.isURL(value)&& value !== ''){
                throw new Error("Wrong format of website");
            }
        }
    },
    followers: [{
            userHandle: {
              type: String,
              required: true,
            }
    }],
    following: [{
        userHandle: {
          type: String,
          required: true,
        }
}],
    tokens: [{
        token:{
            type:String,
            required: true
        }
    }],
    avatar: {
        type: Buffer,
     }
},{
    timestamps:true
})


userSchema.virtual('screams',{
    ref: 'Scream',
    localField: 'userHandle',
    foreignField: 'owner'
})

userSchema.virtual('comments',{
    ref: 'Comment',
    localField: 'userHandle',
    foreignField: 'userHandle'
})

userSchema.virtual('likes',{
    ref: 'Like',
    localField: 'userHandle',
    foreignField: 'userHandle'
})

userSchema.virtual('recipients',{
    ref: 'Notification',
    localField: 'userHandle',
    foreignField: 'recipient'
})

userSchema.virtual('senders',{
    ref: 'Notification',
    localField: 'userHandle',
    foreignField: 'sender'
})

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    
    const token =jwt.sign({_id: user._id.toString()}, process.env.JWTTOKEN);
    
    user.tokens = user.tokens.concat({token})
    await user.save()
    
    return token;
} 

userSchema.methods.toJSON = function () {
    const user = this;
    const publicuser = user.toObject();

    delete publicuser.password
    delete publicuser.tokens
    return publicuser
}

userSchema.statics.findbyCredintials = async (Email,password) =>{
    const user = await User.findOne({Email})

    if(!user){
        throw new Error('unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error('unable to login')
    }

    return user
}

userSchema.pre('save',async function (next) {
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()

})

userSchema.pre('remove',async function (next) {
    const user = this;
    await Scream.deleteMany({owner: user.userHandle})
    next()

})


const User = mongoose.model('User',userSchema)

module.exports = User