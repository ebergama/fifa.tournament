// server.js

// set up ========================
if (process.env.NEW_RELIC_LICENSE_KEY) {
    require('newrelic');
} else {
    console.warn("[WARN] Newrelic not enabled");
}

var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var favicon = require('serve-favicon');
var passport = require('passport');
var session = require('express-session');
var RedisStore = require( 'connect-redis' )( session );
var cookieSession = require('cookie-session');
var env = require('node-env-file');

env(__dirname + "/" + (process.env.ENV_FILE || '/env.config'));
app.use(cookieSession({
    keys: ['key1', 'key2']
}));

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
    done(null, user._id.valueOf());
});

var playerService = require("./app/service/PlayerService");
passport.deserializeUser(function(obj, done) {
    if (typeof obj !== 'string') {
        obj = obj._id;
    }
    playerService.getById(mongoose.Types.ObjectId(obj), done);
});


require("./app/config/google")(passport);
// configuration =================

var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    process.env.LOCAL_DB_URL;

mongoose.connect(mongoUri);


app.use( session({
    secret: 'cookie_secret',
    name:   'kaas',
    store:  new RedisStore({
        host: 'localhost',
        port: 6379
    }),
    proxy:  true,
    resave: true,
    saveUninitialized: true
}));
app.use( passport.initialize());
app.use( passport.session());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(methodOverride());

require('./app/api/PlayerApi.js')(app);
require('./app/api/TournamentApi.js')(app);
require('./app/api/MatchApi.js')(app);
require('./app/api/Routes.js')(app, passport);

// listen (start app with node server.js) ======================================
app.set('port', (process.env.PORT));
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
