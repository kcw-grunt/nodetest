var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyparser = require('body-parser'); 
var indexRouter = require('./routes/index');
var tncRouter   = require('./routes/tnc');
var terminalRouter   = require('./routes/terminal');
 
var app = express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
///Define configs prior to route declaration
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Route all subdirectories
app.use('/', indexRouter);
app.use('/tnc', tncRouter);
app.use('/terminal', terminalRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');






// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// catch 404 and forward to error handler
///MUST Be last so route prior can be found
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
