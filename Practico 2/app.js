var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: '1234',
  resave: false,
  saveUninitialized: true
}));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.get('/', function (req, res) {
  var conocido = Boolean(req.session.nombre == "administrador" || req.session.nombre == "operador");

  res.render('index', {
    title: 'Bienvenido al panel de control',
    conocido: conocido,
    nombre: req.session.nombre
  });
});

app.post('/login', function (req, res) {
  if (!req.body.nombre) {
    res.send('Error. Debe ingresar su rol de usuario.');
  }
  else {
    if (req.body.nombre == "administrador" || req.body.nombre == "operador") {
      req.session.nombre = req.body.nombre
      res.redirect('/');
    }
    else {
      res.send('Error. Rol de usuario incorrecto.');
    }
  }
});

app.get('/salir', function (req, res) {
  req.session.destroy();
  res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
