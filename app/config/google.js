var GoogleStrategy = require('passport-google-oauth2').Strategy;
var parser = require("../model/playerParser");
var playerService = require("../service/PlayerService");

//FIXME: handle this better
var __createNewPlayer = function(jsonPlayer, callback) {
    var dbPlayer = parser.parse(jsonPlayer);
    if (dbPlayer) {
        playerService.getByGoogleId(dbPlayer.googleId, function(err, player) {
            if (err) console.error(err);
            else if (player) {
                console.info("Player already created. " + dbPlayer.username);
                callback.call(this, player);
            } else {
                playerService.save(dbPlayer, function(err, saved) {
                    if (err) {
                        console.error("cannot save player");
                    } else {
                        console.info("Player saved");
                        callback.call(this, saved);
                    }
                })
            }
        })
    }
};

module.exports = function(passport) {
    if (!process.env.GOOGLE_CLIENT_ID && ! process.env.GOOGLE_CLIENT_SECRET) {
        console.warn("[WARN] Google client id and secret not valid, login disabled.");
    }
    
    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID || '0',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '0',
            callbackURL: (process.env.HEROKU_URL || process.env.LOCAL_URL + ":" + process.env.PORT) + "/auth/google/callback",
            passReqToCallback   : true

        },
        function(request, accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            __createNewPlayer(profile, function(player) {
                process.nextTick(function () {
                    return done(null, player);
                })
            })
            ;
        }
    ));
};