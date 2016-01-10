var nodemailer = require('nodemailer');
var _ = require("underscore");
var __ = require("../constants");
var playerService = require("../service/PlayerService");

var config = {
    service: 'gmail',
    auth: {
        user: process.env.FIFA_EMAIL,
        pass: process.env.FIFA_EMAIL_PASS
    }
};
var transporter = nodemailer.createTransport(config);

var sendEmail = function(to, subject, body) {
    transporter.sendMail({
        from: config.auth.user,
        to: to,
        subject: subject,
        text: body,
        bcc: process.env.ADMIN_EMAILS
    });
};

var hasConfigAvailable = function() {
    if (!config.auth.user || !config.auth.pass) {
        console.warn("[WARN] Email account settings not set, skipping email send.");
        return false;
    }
    return true;
};

var formatTeam = function(match, homeOrAway) {
    var players = match.getPlayers(homeOrAway);
    var player = players[0];
    var partner = players[1];
    var suffix = '';
    if (partner) {
        suffix = " & " + partner;
    }
    return "\t" + player + suffix + 
        "\n\tGoals: "+ match.getGoals(homeOrAway) + ", Yellow cards: " + match.getYellowCards(homeOrAway) + ", Red cards: " + match.getRedCards(homeOrAway);
};

var sendMatchEmail = function(match, tournamentName, isNew) {
    if (!hasConfigAvailable()) {
        return;
    }
    var creator = match.getCreatedBy();
    var condition = {"$or": []};
    _.each(match.getAllPlayers(), function(alias) {
        condition["$or"].push({"alias": alias})
    });
    var formatRanking = function (dbPlayers) {
        var result = "Ranking: \n";
        _.each(dbPlayers, function (object) {
            result += object.alias + ": " + object.ranking + ", delta: " + (object.ranking - object.previousRanking).toFixed(2) + "\n";
        });
        return result;
    };

    playerService.getPlayersBy(condition, function(err, dbPlayers) {
        if (err) {
            console.error(err);
        } else {
            var textValues = [];
            _.each(dbPlayers, function(object) {
                textValues.push(object.email);
            });
            var body = "Match highlights: \n\n" +
                "Tournament: " + tournamentName + ", Phase: " + match.getPhase() + "\n\n" +
                "Home Team: \n" +
                formatTeam(match, __.HOME) + "\n" +
                "----\n" +
                "Away Team: \n" +
                formatTeam(match, __.AWAY) + "\n\n" +
                formatRanking(dbPlayers) +
                "Cheers, The Fifa Medallia Team\n " + (process.env.HEROKU_URL) ;
            sendEmail(textValues.join(), creator + " " + (isNew ? 'added' : 'modified') + ' a match in which you played', body)
        }
    });
};

hasConfigAvailable();
module.exports = {
    sendMatchEmail: sendMatchEmail
};