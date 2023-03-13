const express = require('express');
const bodyParser= require('body-parser');
const db = require('./config/connection');
const path = require('path');
const dotenv =  require('dotenv').config();
const indexRouter = require('./routes/index');


const app =  express();


const PORT = process.env.PORT || 5001

//import swagger
const swaggerDocs = require('./libs/swagger/swagger');



db.connect((err)=>{
    if(err) console.log(err);
    else console.log('db connection succuss');
});


app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded( {limit:'30mb',extended:true}));


app.use('/',indexRouter)



app.listen(PORT,()=>console.log(`server is running on port ${PORT}`));

//configure the swagger
swaggerDocs(app,PORT);
