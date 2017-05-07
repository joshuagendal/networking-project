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
}, (req, email, password, done) => { // this is the callback... returns request object and email and password
                                    // err is the first value in he callback function, "error first callback" so if theres
  User.findOne({'email' : email}, (err, user) => { // callback function to test user email.
    if(err){                        // if error ||||  'email' is a variable that is passed into the callback function
      return done(err);             // on the previous line |||| err is like an invalid request
    }
                                    // if error, terminates on line 27
    if(user){                       // if user already exists in the database
      return done(null, false, req.flash('error', 'User with email already exists'));
    }
    // getting model instance. intializing |||||| ES6 is the new standard for 2016 JS like python 3 ||||| extracting values
    const { fullname, email, password } = req.body;   // const is used for variables that will not be reassigned ||||| this is body parser. idea of body parser allows you to get info from fields
    const newUser = new User({                        // js destructuring assignment: have object, instead of doing object.field, extracting info from body
      fullname,
      email                                             // stuff inside request body
    });       // (else- no errors or in-use username. creates instance of a new user)   ::::: Body parser enables us to get data fom our page or form and will pass whatever is in name
    newUser.encryptPassword(password);       // reason moved outside of document: encrypt passowrd is an instance method

   // newUser.fullname = req.body.fullname;
   //  newUser.email = req.body.email;
   //  newUser.password = newUser.encryptPassword(req.body.password);

    newUser.save((err, newUser) => {
      console.log('Error saving' + err);
    });
    console.log(user, 'Signup strategy');
    return done(null, newUser);        // return ends the client's request to he server. it was in an infinite loop
  });                               // DONE: callback function. return null and user, means there was SUCCESS
}));
                                    // Body parser enables us to get data fom our page or form.
                                    // Using body parser (the 'body' in req.body will pass whatever is in the 'name'
                                    //field  of this code of the name field in this following code
                                    // <form method="POST"> <input id="fullname" class="form-control" name="fullname" type="text" autocomplete="on" placeholder="FULLNAME" style="margin-top: 50px; margin-bottom:20px;" >
                                    // Same for email and password
passport.use('local.login', new LocalStrategy({   // 'local.login is the NAME of the strategy'
  usernameField: 'email',                         // normally it's username you should supply, but we are using email in this case
  passwordField: 'password',
  passReqToCallback: true           // tells us to pass the info we get in request to the callback function
}, (req, email, password, done) => { // request FIRST- very important 

  // user model query w/ email as criteria
  User.findOne({'email' : email}, (err, user) => { // callback function to test user email.
    if(err){                        // if error ||||  'email' is a variable that is passed into the callback function
      return done(err);             // on the previous line
    }
                                    // endpoint is URL!!!
    const messages = [];

    if(!user || !user.validPassword(password)){                       // if email doesnt exist in db 
      messages.push('Email does not exist or password is invalid');
      return done(null, false, req.flash('error', messages));
    }

    return done(null, user);

    });

  }));
                                      // use semicolons often.. can do without it, but situation where if you don't use it, it will try to do somehting you didn't think about

