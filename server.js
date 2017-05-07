var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var ejs = require('ejs');
var engine = require('ejs-mate');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var flash = require('connect-flash');
var mongoose = require('mongoose');


var app = express();

mongoose.Promise = global.Promise;              // changed from bluebird (npm i bluebird). if problems later on might be cuz have to uninstall bluebird
mongoose.connect('mongodb://localhost/rateme'); //rateme is name of db

require('./config/passport');

app.use(express.static('public'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(validator()); // must be after middleware for body parser... validation must be INSIDE ROUTES

app.use(session({
  secret: 'Thisismytestkey',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

require('./routes/user')(app);

app.get('/test', function(req, res, next){
  res.render('test');
});

app.listen(3000, function(){
  console.log('App running on port 3000');
});

// server.js is ENTRANCE to application

// need to make sure you are getting userid to save in database and stuff
