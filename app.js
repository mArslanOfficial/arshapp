//in this project i have created an API based Node.js Server using Passport.js
//for database i have used mongoDB 4.0
//to create this project i used Atom Editor with atom-live-server
// I have used git-bash for commands 

/*--------------------------------------------------------------------------------------
1. First thing that i have done is, I created "package.json" file using command "npm init"
   then i add some details like package name, version, Description, Author etc.
   The package.json file is under root folder.
----------------------------------------------------------------------------------------
2. Then i add some dependencies which is:
    "bcryptjs": "*",
    "body-parser": "*",
    "connect-flash": "*",
    "cookie-parser": "^1.4.1",
    "express": "*",
    "express-handlebars": "*",
    "express-messages": "*",
    "express-session": "*",
    "express-validator": "*",
    "mongodb": "*",
    "mongoose": "*",
    "passport": "*",
    "passport-http": "*",
    "passport-local": "*"
------------------------------------------------------------------------------------------
*/


//Required files 
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

//to make connection
mongoose.connect('mongodb://localhost/arshapp');
var db = mongoose.connection;

//for route
var routes = require('./routes/index');
var users = require('./routes/users');

// here i initialized my app
var app = express();

// this is for View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// it's a BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// I have set a folder
app.use(express.static(path.join(__dirname, 'public')));

// An express session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// must file for passport initialization
app.use(passport.initialize());
app.use(passport.session());

// this is express validator for validation process. i grab it from github
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// to connect to flash
app.use(flash());

// these are global variables and must declare with res.local.parameterHere
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);

// to Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});