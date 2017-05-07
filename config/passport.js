var passport = require('passport');
var User = require('../models/user')
var LocalStrategy = require('passport-local').Strategy;



var User = require('../models/user'); // access to mongoose db schema

passport.serializeUser((user, done) => { // takes user id saved inside session
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => { // mongodb query for user id
    done(err, user) // once it takes id saved in session, IF FOUND will save all data inside user object
  });                  // all data saved inside of user objec
});

passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true           // tells us to pass the info we get in request to the callback function
}, (req, email, password, done) => {

  User.findOne({'email' : email}, (err, user) => { // callback function to test user email.
    if(err){                        // if error ||||  'email' is a variable that is passed into the callback function
      return done(err);             // on the previous line
    }

    if(user){                       // if user already exists in the database
      return done(null, false, req.flash('error', 'User with email already exists'));
    }

    var newUser = new User();       // (else- no errors or in-use username. creates instance of a new user)   ::::: Body parser enables us to get data fom our page or form and will pass whatever is in name
    newUser.fullname = req.body.fullname;
    newUser.email = req.body.email;
    newUser.password = newUser.encryptPassword(req.body.password);

    newUser.save((err) => {

    })


  });
}));
                                    // Body parser enables us to get data fom our page or form.
                                    // Using body parser (the 'body' in req.body will pass whatever is in the 'name'
                                    //field  of this code of the name field in this following code
                                    // <form method="POST"> <input id="fullname" class="form-control" name="fullname" type="text" autocomplete="on" placeholder="FULLNAME" style="margin-top: 50px; margin-bottom:20px;" >
                                    // Same for email and password
passport.use('local.login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true           // tells us to pass the info we get in request to the callback function
}, (req, email, password, done) => {

  User.findOne({'email' : email}, (err, user) => { // callback function to test user email.
    if(err){                        // if error ||||  'email' is a variable that is passed into the callback function
      return done(err);             // on the previous line
    }

    var messages = [];

    if(!user || !user.validPassword(password)){                       // if email doesnt exist in db 
      messages.push('Email does not exist or password is invalid')
      return done(null, false, req.flash('error', messages));
    }

    return done(null, false);

    });

  }));

