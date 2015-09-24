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
        bcc: 'ezequiel@medallia.com,santiago@medallia.com,nicolas@medallia.com'
    });
};

var hasConfigAvailable = function() {
    if (!config.auth.user || !config.auth.pass) {
        console.warn("[WARN] Email account settings not set, skipping email send.");
        return false;
    }
    return true;
};

var findUsersForMatchEmail = function(match) {
    var findIn = function (players, alias) {
        return players.indexOf(alias) != -1;
    };
    var createdByAlias = match.getCreatedBy();
    var homePlayers = match.getPlayers(__.HOME);
    var awayPlayers = match.getPlayers(__.AWAY);

    if (findIn(homePlayers, createdByAlias)) {
        return awayPlayers;
    } else if (findIn(awayPlayers, createdByAlias)) {
        return homePlayers;
    } else {
        return _.union(homePlayers, awayPlayers);
    }
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

var sendMatchEmail = function(match, tournamentName) {
    if (!hasConfigAvailable()) {
        return;
    }
    var creator = match.getCreatedBy();
    var body = "Match highlights: \n\n" +
            "Tournament: " + tournamentName + ", Phase: " + match.getPhase() + "\n\n" +
            "Home Team: \n" +
            formatTeam(match, __.HOME) + "\n" +
            "----\n" +
            "Away Team: \n" +
            formatTeam(match, __.AWAY) + "\n\n" +
        "Cheers, The Fifa Medallia Team\n " + (process.env.HEROKU_URL) ;
    var aliases = findUsersForMatchEmail(match);
    var condition = {"$or": []};
    _.each(aliases, function(alias) {
        condition["$or"].push({"alias": alias})
    });
    playerService.getPlayersBy(condition, function(err, values) {
        if (err) {
            console.error(err);
        } else {
            var textValues = [];
            _.each(values, function(object) {
                textValues.push(object.email);
            });
            sendEmail(textValues.join(), creator + ' added a match in which you played', body)
        }
    });
};

hasConfigAvailable();
module.exports = {
    sendMatchEmail: sendMatchEmail
};