var express = require('express');
var app = express();
//var server = require('http').createServer(app)
//var io = require('socket.io')(server)

var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var db = require('./config/db.js');

// configuration ===============================================================
mongoose.connect(db.url, function(err){
    if (err){
        console.log(err)
    }
    else {
        console.log('we connected to mongo nigga')
    }
}); // connect to our database


// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json()); // get information from html forms


app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static(__dirname + '/views')) // serv static content in views
app.use(express.static(__dirname + '/bower_components'));
app.use('/authenticate', express.static('views')); //?
app.use('/authenticate', express.static('bower_components'));

// required for passport
app.use(session({
    secret: 'ILOVEUCRCHATSITE',
    resave : false,
    saveUninitialized : false
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./config/passport')(passport); // pass passport for configuration
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port, function(){
    console.log('we in nigga at port ' + port);
});


/*io.on('connection', function(socket){
    console.log('we in')
})*/
