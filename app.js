var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
var logger = require('morgan');

const i18next      = require('i18next');
const i18next_mw   = require('i18next-express-middleware');
const i18next_be   = require('i18next-node-fs-backend');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended:false}));  // parsing HTTP for url-encoded data
app.use(bodyParser.json());      // parsing HTTP body for JSON data
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* create internationalization service */
i18next
  .use(i18next_mw.LanguageDetector)
  .use(i18next_be)
  .init({
    fallbackLng: {
      'de-DE':['de'],
      default:['en'],
    },
    debug: true,
    preload: ["en","de"],
    saveMissing:true,
    saveMissingTo:'all',
    backend: {
      loadPath: __dirname+'/locales/{{lng}}/{{ns}}.json',
      addPath: __dirname+'/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      // order and from where user language should be detected
      order: ['header'],

      // keys or params to lookup language from
      lookupHeader: 'accept-language',
      // cache user language
      caches: false, // ['cookie']
    }
  });

app.use(i18next_mw.handle(i18next,{
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
