var createError = require('http-errors');
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var route = require('./routes/index');
const morgan = require('morgan');
const http = require('http');
const moment = require("moment");
var app = express();
var session = require('express-session');
const sessionVariable = require('./app/middlewares/session');

//create server
http.Server(app).listen(process.env.PORT || 3000);
app.locals.baseUrl = 'http://localhost:3000';

// session
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'nEvJCqX36fBNy8ce',
  }));
app.use(sessionVariable);

//date
moment.locale('vi');
app.use((req, res, next)=>{
  res.locals.moment = moment;
  app.locals.inspect = require('util').inspect;
  res.locals.current_path= req.path;
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set("layout extractScripts", true);
app.set("layout extractStyles", true)
app.set("layout extractMetas", true)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//morgan
app.use(morgan('tiny') );

//route
route(app);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// connect database
const db = require("./config/database");
db.connect();



module.exports = app;
