var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var usersession = require('express-session');

var routes = require('./routes/index');
var party = require('./routes/party');
var parties = require('./routes/parties');


//TODO: you can abstract the 'app' functionality into a separate folder and bring it in , so var app = require('app'), etc

//TODO: Where are you starting your app?
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//TODO: You are sharing your secret data, this should be not visible/available, place in config.json
app.use(session({
  secret: 'password',
  name: 'dj-cookie',
  resave: true,
  saveUninitialized: true,
  cookie: { path: '/'}
}));
app.use(usersession({
  secret: 'ninjadj',
  name: 'user-cookie',
  resave: true,
  saveUninitialized: true,
  cookie: { path: '/users'}
}));

// Route definition
app.use('/', require('./routes/index')); //TODO: As a shortcut, you could just require the files here instead of declaring variables on line 10
app.use('/party', party);
app.use('/parties', parties);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
