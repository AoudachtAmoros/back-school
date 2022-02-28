const createError = require('http-errors');
const http = require('http').createServer();
const express = require('express');
// const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const adminRouter = require('./src/router/admin');
const authRouter = require('./src/router/auth');
const parentRouter = require('./src/router/parent');
const sockets = require('./src/configuration/sockets');
 
 
const app = express();
 
app.use(express.json());
 
app.use(bodyParser.json());
 
app.use(bodyParser.urlencoded({
    extended: true
}));
 
app.use(cors());
 
//app.use('/', authRouter);
//app.use('/', parentRouter);
//app.use('/admin',  adminRouter);
 
// Handling Errors
app.use((err, req, res, next) => {
    // console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      message: err.message,
    });
});
// '192.168.1.54',
http.listen(7000,()=>{
  console.log('Http is running on port : ',7000);
  sockets.start(http)
})
app.listen(3000,() => console.log('Server is running on port 3000'));

