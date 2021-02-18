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

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../public/social-client/build')))
    const path = require('path');
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'public/social-client', 'build', 'index.html'));
    });
  }

app.listen(port, ()=>{
    console.log('Server Started')
})