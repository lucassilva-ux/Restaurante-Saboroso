var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var { RedisStore } = require('connect-redis');
var { createClient } = require('redis');
var formidable = require('formidable');
var path = require('path');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

var app = express();

var redisClient = createClient({
  socket: {
    host: 'localhost',
    port: 6379
  }
});

redisClient.connect().catch(console.error);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(function(req, res, next){

  if (req.method === 'POST' && req.is('multipart/form-data')) {

    console.log('POST RECEBIDO:', req.url);

    var form = new formidable.IncomingForm({
      uploadDir: path.join(__dirname, '/public/images'),
      keepExtensions: true,
      allowEmptyFiles: true,
      minFileSize: 0
    });

    form.parse(req, function(err, fields, files) {
      if (err) {
        return next(err);
      }

      console.log('FORM PARSE FINALIZADO');

      req.fields = fields;
      req.files = files;
      req.body = fields;

      next();
    });

  } else {
    next();
  }
});

app.use(session({

  store: new RedisStore({
    client: redisClient
  }),

  secret: 'p@ssw0rd',
  resave: false,
  saveUninitialized: false
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.error(err);

  if (req.originalUrl === '/admin/menus' && req.method === 'POST') {
    return res.status(err.status || 500).json({
      error: err.message || 'Erro interno ao salvar o menu.'
    });
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
