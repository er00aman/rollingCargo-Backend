import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import dotenv from 'dotenv';
import indexRouter from  './app/routes/index';

var app = express();
require("./app/config/db");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(cors({
  origin: ['http://localhost:4200, https://www.aiwaa.co'],
  "methods": "GET,PUT,POST,PATCH, DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204,
  credentials: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
dotenv.config();
app.use('/api/v1', indexRouter);

// // app.use(express.static(path.join(__dirname, 'public')));
// app.use('/admin-panel', express.static(path.join(__dirname, 'dist/admin')));
// app.get('/admin-panel/*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'dist/admin', 'index.html'));
// })
// app.use('/', express.static(path.join(__dirname, 'dist/user')));
// app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'dist/user', 'index.html'));
// })
app.use('/admin-panel', express.static(path.join(__dirname, 'dist')));
app.get('/admin-panel/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
})
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 400);
  let errorDetails = res.locals.error;
  if(err.details){
    errorDetails = Array.from(err.details.values()).flatMap(e => e.details).map(detail => ({
      message: detail.message,
      path: detail.path
    }));  
  }  
  res.json({
      success: false,
      message: res.locals.message,
      error:  errorDetails
  });
});

process.setMaxListeners(Infinity)  // enable when get warning for EventEmitter memory leak....

module.exports = app;

