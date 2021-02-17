const express = require('express');
const path= require('path')

require('./db/mongoose')
const app = express();

const port = process.env.PORT || 5000
const userRouter = require('./router/user')
const themeRouter = require('./router/theme')
const screamRouter = require('./router/scream')
const cookieParser = require('cookie-parser')


//Middleware for maintanance
/* app.use((req,res,next) =>{
    res.status(503).send('The site is under maintainance')
}) */



app.use(cookieParser())
app.use(express.json())
app.use(userRouter)
app.use(screamRouter)
app.use(themeRouter)

app.use(express.static(path.join(__dirname, '../public/social-client/build')))


app.listen(port, ()=>{
    console.log('Server Started')
})