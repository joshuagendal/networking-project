var passport = require('passport');


module.exports = (app) => {

  app.get('/', (req, res, next) =>{
    res.render('index', {title: 'Index || RateMe'});
  });

  app.get('/signup', (req, res) => {
    var errors = req.flash('error'); // errors from vadiate function below 
    console.log(errors);             // for development only 
    res.render('user/signup', {title: 'Sign Up || RateMe', messages: errors, 
    hasErrors: errors.length > 0}); // if there are errors, will pass error messages to front end
  });

  app.post('/signup', validate, passport.authenticate('local.signup', {
      successRedirect: '/', // if user successfully signs up via passport
      failureRedirect: '/signup',
      failureFlash : true
  }));

  app.get('/login', (req, res) => {
    var errors = req.flash('error'); // errors from vadiate function below 
    console.log(errors);             // for development only 
    res.render('user/login', {title: 'Login || RateMe', messages: errors, 
    hasErrors: errors.length > 0}); // if there are errors, will pass error messages to front end
  });

  app.post('/login', loginValidation, passport.authenticate('local.login', {
      successRedirect: '/home', // if user successfully signs up via passport
      failureRedirect: '/login',  // intention: to authenticate w/ Passport. Before authentication, you validate users info. GOAL is t
      failureFlash : true
  }));

  app.get('/home', (req, res) => {
    res.render('home', {title: 'Home || RateMe'});
  });
}

// =============== USER SIGN UP VALIDATION ===================== 

function validate(req, res, next){ // these are express-validator functions
  req.checkBody('fullname', 'Fullname is required').notEmpty(); // full name is the name of the field to be checked, and the second argument is the error message to be displayed
  req.checkBody('email', 'Fullname Must Not Be Less Than 5').isLength({min:5}); // this checks to make sure the 'fullname' field is at least 5 characters
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is invalid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('email', 'Password must not be less than 5 characters').isLength({min:5});
  req.check("password", "Password Must Contain at least 1 Number.").matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, "i"); // 

  var errors = req.validationErrors();

  if(errors){
    var messages = [];
    errors.forEach((error) => {
      messages.push(error.msg);
    });

    req.flash('error', messages); // passing error to req.flash to display message to users
    res.redirect('/signup'); 
  }else {
    return next(); // if no errors, will execute |next| callback
  }
}

function loginValidation(req, res, next){ // these are express-validator functions
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is invalid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('email', 'Password must not be less than 5 characters').isLength({min:5});
  req.check("password", "Password Must Contain at least 1 Number.").matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, "i"); // 

  var loginErrors = req.validationErrors();

  if(loginErrors){
    var messages = [];
    loginErrors.forEach((error) => {
      messages.push(error.msg);
    });

    req.flash('error', messages); // passing error to req.flash to display message to users
    res.redirect('/login'); 
  }else {
    return next(); // if no errors, will execute |next| callback
  }                // next is a callback. special callback that takes you to the NEXT middleware. up to 20 middlewares
   
}