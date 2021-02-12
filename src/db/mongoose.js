const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODBURI,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useFindAndModify:false
});

 
 