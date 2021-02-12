const jwt = require('jsonwebtoken')
const User = require('../models/user')


const auth = async (req,res,next) =>{
    try{
        const token = req.cookies['auth_token']
        const decoded = jwt.verify(token,process.env.JWTTOKEN);
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()

    }catch(e){
        console.log(e)
        res.status(401).send({error: 'Problem with auth'})
    }


}

module.exports = auth;