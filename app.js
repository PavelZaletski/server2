const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const winston = require('winston');

const indexRouter = require('./routes/index');
const newsRouter = require('./routes/news');
const registrationRouter = require('./routes/registration');
const loginRouter = require('./routes/login');
const authRouter = require('./routes/auth');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const User = require('./models/user');
const flash = require('express-flash');
const facebookParams = require('./config');

const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err); 
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password != password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.use(new FacebookStrategy(facebookParams,
  function(accessToken, refreshToken, profile, done) {
    User.findOne({facebookId: profile.id}, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (!err && user !== null) {
        return done(null, user);
      } else {
        user = new User({ 
          username: profile.displayName
        });
        user.facebookId = profile.id;
        user.firstname = profile.name.givenName;
        user.lastname = profile.name.familyName;
        user.save((err, user) => {
          if (err)
            return done(err, false);
          else 
            return done(null, user);
        })
      }
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

mongoose.connect('mongodb://heroku_9xnpcngg:gtku3sh04lbqunq4uq5mtvbavr@ds127878.mlab.com:27878/heroku_9xnpcngg');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: "cats",
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: {service: 'user-service'},
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

app.use((req, res, next) => {
  logger.log({
    level: 'info',
    message: `${new Date()}: ${req.method} URL = ${req.url}`,
  });
  next();
})

app.use('/', indexRouter);
app.use('/news', newsRouter);
app.use('/registration', registrationRouter);
app.use('/login', loginRouter);
app.use('/auth', authRouter);

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
