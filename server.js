var express = require('express');
var path = require('path');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session')
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var api = require('./routes/api');
var auth = require('./routes/auth');
var session = require('express-session');
var app = express();
var RedisStore = require('connect-redis')(session);

// app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(cookieSession({
  secret: 'makersquare'
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/auth', auth.router);
app.use('/api/1', api.router);

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
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  // res.render('error', {
  //   message: err.message,
  //   error: {}
  // });
});

module.exports = app;

if (!module.parent) {
  var http = require('http');
  var port = process.env.PORT || 3000;
  app.set('port', port);

  var server = http.createServer(app);
  server.listen(port);
  server.on('listening', function() {
    console.log('Listening on ' + port);
  });
  server.on('error', function(error) {
    console.error(error);
  });
}
